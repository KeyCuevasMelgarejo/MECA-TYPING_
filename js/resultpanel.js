const ResultPanel = {
    elements: {
        main: null,
        itemsContainer: null,
        items: [],
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.itemsContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("resultpanel", "resultpanel--hidden");
        this.elements.itemsContainer.classList.add("resultpanel__items");
        this.elements.itemsContainer.classList.add("resultpanel__item--row");
        this.elements.itemsContainer.appendChild(this._createItems());

        this.elements.items = this.elements.itemsContainer.querySelectorAll(".resultpanel__item");

        // Add to DOM
        this.elements.main.appendChild(this.elements.itemsContainer);
        document.body.appendChild(this.elements.main);

        this.open();
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
            const itemElement = document.createElement("div");
            const contentItem = document.createElement("div");

            // Add attributes/classes
            itemElement.classList.add("resultpanel__item");

            switch (item) {
                case "time":
                    let timeFinish = moment();
                    let timeTotal=timeFinish.diff(timeInit); // diff yields milliseconds
                    let timeUsed=moment.duration(timeTotal);
	
                    let sg=timeUsed.seconds(); //seconds 	
                    let mn=timeUsed.minutes(); //minutes 	
                    let ho=timeUsed.hours(); //hours 	
                    //add '0' on result less than 10			 
                    if(ho<10){ho="0"+ho;} 
                    if(sg<10){sg="0"+sg;} 
                    if(mn<10){mn="0"+mn;} 

                    itemElement.classList.add("resultpanel__item--row");
                    itemElement.innerHTML = createIconHTML("update")+"&nbsp;TIEMPO UTILIZADO:";

                    contentItem.classList.add("resultpanel__item--content");
                    contentItem.innerHTML = ho+":"+mn+":"+sg;

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
                    let sobreCien=(((numPalabras-error)*100)/numPalabras);
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
                    const btnPracticeAgain=document.createElement("button");
                    const btnReadBook=document.createElement("button");
                    
                    // mark icon
                    itemElement.classList.add("resultpanel__item--column");
                    itemElement.innerHTML = createIconHTML("bookmark");

                    // book preview
                    contentItem.classList.add("resultpanel__item--book","column");
                    contentItem.innerHTML = '<span>'+book.title+'</span><br><embed type="application/pdf" src="'+book.url+'#toolbar=0&navpanes=0&scrollbar=0" width="250" height="268">';

                    // buttons
                    btnPracticeAgain.classList.add("btn-book");
                    btnPracticeAgain.onclick = function() {history.go(0);}; // refresh page
                    btnPracticeAgain.innerHTML = '<i class="material-icons-outlined">keyboard_hide</i> Seguir Practicando';
                    
                    btnReadBook.classList.add("btn-book");
                    btnReadBook.onclick = function() {history.go(0);}; // for IE
                    btnReadBook.innerHTML = '<i class="material-icons-outlined">auto_stories</i> Leer Texto Completo';

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

    open() {
        this.elements.main.classList.remove("resultpanel--hidden");
    }
};

