const ClassRoomView = {
    elements: {
        main: null,
        studentsContainer:null,
        students:[],
        optionsContainer: null,
        obtions: []
    },

    init(){
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.studentsContainer = document.createElement("div");
        this.elements.optionsContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("modal-classroomview");
        this.elements.studentsContainer.classList.add("modal-classroomview__students");
        this.elements.optionsContainer.classList.add("modal-classroomview__options");
        this.elements.optionsContainer.appendChild(this._createOptions());

        // Add to DOM as first element on body
        this.elements.main.appendChild(this.elements.studentsContainer);
        this.elements.main.appendChild(this.elements.optionsContainer);
        document.querySelector(".modal-content").insertBefore(this.elements.main, document.querySelector(".modal-content").lastChild);
    },

    _createOptions(){
        const fragment = document.createDocumentFragment();
        let optionsLayout = ["new","init","pause","stop"];

        optionsLayout.forEach(option => {
            const optionElement=document.createElement("button");
            
            // Add attributes/classes
            optionElement.setAttribute("type", "button");
            optionElement.classList.add("btn-tiny");

            switch (option){
                case "new":
                    optionElement.title = "Nueva Práctica";
                    optionElement.innerHTML = '<i class="fas fa-sync-alt"></i>';
                    break;
                case "init":
                    optionElement.title = "Iniciar";
                    optionElement.innerHTML = '<i class="fas fa-play-circle"></i>';
                    break;
                case "pause":
                    optionElement.title = "Pausar";
                    optionElement.innerHTML = '<i class="fas fa-pause-circle"></i>';
                    break;
                case "stop":
                    optionElement.title = "Detener";
                    optionElement.innerHTML = '<i class="fas fa-stop-circle"></i>';
                    break;
            }

            fragment.appendChild(optionElement);
        });

        return fragment;
    }
}