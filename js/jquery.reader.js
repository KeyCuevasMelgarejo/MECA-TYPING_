var Page = (function() {
	// globals
	var $container = $( '#container' ),
		$bookBlock,
		$items,
		current = 0,
		bb,
		$navNext = $( '#bb-nav-next' ),
		$navPrev = $( '#bb-nav-prev' ).hide(),
		$tblcontents = $( '#tblcontents' ),
		$numPages = 0

	function init() {
		// get parameter sent by btn-book on resultpanel.js
		let book = window.location.search.slice(1)
					.split('&')
					.reduce(function _reduce (/*Object*/ a, /*String*/ b) {
						b = b.split('=');
						a[b[0]] = decodeURIComponent(b[1]);
						return a;
					}, {});

		// change title of document (html -> head)
		$(document).attr("title","MecaTyping - "+book.title);

		_fillContent(book.url);
	}
	
	function initEvents() {
		// add navigation events
		$navNext.on( 'click', function() {
			bb.next();
			return false;
		} );

		$navPrev.on( 'click', function() {
			bb.prev();
			return false;
		} );
		
		// add swipe events
		$items.on( {
			'swipeleft'		: function( event ) {
				if( $container.data( 'opened' ) ) {
					return false;
				}
				bb.next();
				return false;
			},
			'swiperight'	: function( event ) {
				if( $container.data( 'opened' ) ) {
					return false;
				}
				bb.prev();
				return false;
			}
		} );

		// show table of contents
		$tblcontents.on( 'click', toggleTOC );

		// reinit jScrollPane on window resize
		$( window ).on( 'debouncedresize', function() {
			// reinitialise jScrollPane on the content div
			setJSP( 'reinit' );
		} );
	}

	function setJSP( action, idx ) {
		var idx = idx === undefined ? current : idx,
			$content = $items.eq( idx ).children( 'div.content' ),
			apiJSP = $content.data( 'jsp' );
		
		if( action === 'init' && apiJSP === undefined ) {
			$content.jScrollPane({verticalGutter : 0, hideFocus : true });
		}else if( action === 'reinit' && apiJSP !== undefined ) {
			apiJSP.reinitialise();
		}else if( action === 'destroy' && apiJSP !== undefined ) {
			apiJSP.destroy();
		}
	}

	function updateNavigation( isLastPage ) {
		if( current === 0 ) {
			$navNext.show();
			$navPrev.hide();
		}else if( isLastPage ) {
			$navNext.hide();
			$navPrev.show();
		}else {
			$navNext.show();
			$navPrev.show();
		}
	}

	function toggleTOC() {
		window.close();
	}

	async function _fillContent(url){
		$bookBlock = $( '#bb-bookblock' ); // document.querySelector()

		// to create elements
		let $bbItem;
		let $content;
		let $scroller;
		
        try{
            // extract pdf text
			let textItems=[];
			let finalString = "";
			let line=0;
            let doc = await PDFJS.getDocument(url).promise;
            let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
				textItems=(await (await doc.getPage(i+1)).getTextContent()).items;

				// Concatenate the string of the item to the final string
                for (let i = 0; i < textItems.length; i++) {
					let item = textItems[i];
                    if (line != item.transform[5]) {
                        if (line != 0) {
							finalString +='\r\n'; // means add new line to each line
                        }
                        line = item.transform[5];
                    }                     
                    finalString += item.str;

					// means add new line to each line which ends on '.' punctuation symbol
					// and text is over 200 worlds
					if(item.str.trim().slice(-1).indexOf(".") > -1){
						finalString +='\r\n';
					} 
                }
                return finalString;
            });

            // when finish extraction, fill pdf text on scroller div
			let pageNum=0;
			let textMerged="";
            let textExtractFromPDF=(await Promise.resolve(pageTexts[pageTexts.length-1]));
			let textCompressed=textExtractFromPDF.trim();
			let textSplitted=textCompressed.split('\r\n\r\n');

			for(let i = 0; i < textSplitted.length; i++){
				$bbItem = $("<div></div>");
				$content = $("<div></div>");
				$scroller = $("<div></div>");

				// Setup elements
				$bbItem.addClass("bb-item");
				$content.addClass("content");
				$scroller.addClass("scroller");

				textMerged+=textSplitted[i];

				// if paragraph is less than X then merge
				if(textSplitted[i].length < 400 && i!=textSplitted.length-1) {
					continue;
				}
				$scroller.html('<p>'+textMerged+'</p>'); // .innerHTML=
				$bbItem.attr("id", "item"+(1+pageNum)); // .setAttribute()
				// add to DOM
				$content.append($scroller);
				$bbItem.append($content);
				$bookBlock.append($bbItem);

				textMerged='';
				pageNum++;
			}	
			$numPages = pageNum;
        }catch(e){
            console.log(e.message);

			// Create elements
			$bbItem = $("<div></div>"); // document.createElement()
			$content = $("<div></div>");
			$scroller = $("<div></div>");
			// Setup elements
			$bbItem.addClass("bb-item"); // .classList.add()
			$content.addClass("content");
			$scroller.addClass("scroller");
            // message on error
			$scroller.html('<h2>¡Ups!</h2><p>Error al cargar el texto</p>');
			// just needs item1 (means one page) for one single message
			$bbItem.attr("id", "item1"); // .setAttribute()
			// add to DOM
			$content.append($scroller);
			$bbItem.append($content);
			$bookBlock.append($bbItem);
        }

		// hide 'next arrow button' for error message or which just contents one paragraph
		if($numPages ===0 || $numPages===1){$navNext.hide();}

		// initialize bookblock global variables
		$items = $bookBlock.children(),
		bb = $( '#bb-bookblock' ).bookblock( {
			speed : 800,
			perspective : 2000,
			shadowSides	: 0.8,
			shadowFlip	: 0.4,
			onEndFlip : function(old, page, isLimit) {
				current = page;
				// updateNavigation
				updateNavigation( isLimit );
				// initialize jScrollPane on the content div for the new item
				setJSP( 'init' );
				// destroy jScrollPane on the content div for the old item
				setJSP( 'destroy', old );
			}
		} ),

		// initialize jScrollPane on the content div of the first item
		setJSP( 'init' );

		initEvents();
    }

	return { init : init };
})();