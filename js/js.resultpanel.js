const ResultPanel = {
    elements: {
        main: null,
        itemsContainer: null
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.itemsContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("resultpanel");
        this.elements.itemsContainer.classList.add("resultpanel__items");
        this.elements.itemsContainer.classList.add("resultpanel__item--row");
        this.elements.itemsContainer.appendChild(this._createItems());

        // Add to DOM as first element on body
        this.elements.main.appendChild(this.elements.itemsContainer);
        document.body.insertBefore(this.elements.main, document.body.firstChild);

        this.open(this.elements.main.classList);
    },

    _createItems() {
        const fragment = document.createDocumentFragment();

        const leftContainer = document.createElement("div");
        leftContainer.classList.add("resultpanel__item--column");

        const rightContainer = document.createElement("div");
        rightContainer.classList.add("resultpanel__item--column");

        let itemLayout = ["time","error","success","qualification","book"];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons-outlined">${icon_name}</i>`;
        };

        itemLayout.forEach(item => {
            const itemElement = document.createElement("div"),
                contentItem = document.createElement("div");

            // Add attributes/classes
            itemElement.classList.add("resultpanel__item");

            switch (item) {
                case "time":
                    // add plugin duration.min.js to dayjs
                    dayjs.extend(dayjs_plugin_duration);
                    
                    let timeTotal=timeFinish.diff(timeInit), // diff yields milliseconds
                        timeUsed=dayjs.duration(timeTotal).format('HH:mm:ss');

                    itemElement.classList.add("resultpanel__item--row");
                    itemElement.innerHTML = createIconHTML("update")+"&nbsp;TIEMPO UTILIZADO:";

                    contentItem.classList.add("resultpanel__item--content");
                    contentItem.innerHTML = timeUsed;

                    itemElement.appendChild(contentItem);
                    leftContainer.appendChild(itemElement);
                    break;
                case "error":
                    itemElement.classList.add("resultpanel__item--row");
                    itemElement.innerHTML = createIconHTML("new_releases")+"&nbsp;NÚMERO DE ERRORES:";
                    
                    contentItem.classList.add("resultpanel__item--content");
                    contentItem.innerHTML = error;

                    itemElement.appendChild(contentItem);
                    leftContainer.appendChild(itemElement);
                    break;
                case "success":
                    itemElement.classList.add("resultpanel__item--row");
                    itemElement.innerHTML = createIconHTML("verified")+"&nbsp;NÚMERO DE ACIERTOS:";
                    
                    contentItem.classList.add("resultpanel__item--content");
                    contentItem.innerHTML = success;

                    itemElement.appendChild(contentItem);
                    leftContainer.appendChild(itemElement);
                    break;
                case "qualification":
                    let sobreCien=(((numPalabras)*100)/(success+error));
                    let sobreVeinte=(sobreCien*20)/100;

                    itemElement.classList.add("resultpanel__item--row");
                    if(success>error){
                        itemElement.innerHTML = createIconHTML("sentiment_very_satisfied")+"&nbsp;CALIFICACIÓN ("+sobreCien.toFixed(2)+"%) :";
                    }else{
                        itemElement.innerHTML = createIconHTML("sentiment_very_dissatisfied")+"&nbsp;CALIFICACIÓN ("+sobreCien.toFixed(2)+"%) :";
                    }
                    contentItem.classList.add("resultpanel__item--content");
                    contentItem.innerHTML = sobreVeinte.toFixed(2);

                    itemElement.appendChild(contentItem);
                    leftContainer.appendChild(itemElement);
                    break;
                case "book":
                    const btnPracticeAgain=document.createElement("button"),
                        btnReadBook=document.createElement("button");
                    
                    // mark icon
                    itemElement.classList.add("resultpanel__item--column");
                    itemElement.innerHTML = createIconHTML("bookmark")+"&nbsp;EXTRACTO DE LA OBRA:";

                    // book preview
                    contentItem.classList.add("resultpanel__item--book","column");
                    contentItem.innerHTML = '<span>'+book.title+'</span><br><object type="application/pdf" data="'+book.ur+'#toolbar=0&navpanes=0&scrollbar=0" frameborder="0" width="250" height="268"><embed type="application/pdf" src="'+book.url+'#toolbar=0&navpanes=0&scrollbar=0" frameborder="0" width="250" height="268"></embed></object>';

                    // buttons
                    btnReadBook.classList.add("btn-book");
                    btnReadBook.onclick = function() {window.open('bookreader.html?url='+book.url+'&title='+book.title,'_blank').focus();}; // post parameter to page.js
                    btnReadBook.innerHTML = '<i class="material-icons-outlined">auto_stories</i> Leer Texto Completo';

                    btnPracticeAgain.classList.add("btn-book");
                    btnPracticeAgain.onclick = function() {history.go(0);}; // refresh page
                    btnPracticeAgain.innerHTML = '<i class="material-icons-outlined">keyboard_hide</i> Seguir Practicando';

                    // add elements to DOM
                    itemElement.appendChild(contentItem);
                    itemElement.appendChild(btnReadBook);
                    itemElement.appendChild(btnPracticeAgain);

                    rightContainer.appendChild(itemElement);
                    break;
            }
        });
        fragment.appendChild(leftContainer);
        fragment.appendChild(rightContainer);
        return fragment;
    },

    open(classList) {
        setTimeout(function() {
            classList.add("resultpanel--showen");
        }, 2000);
    }
};

