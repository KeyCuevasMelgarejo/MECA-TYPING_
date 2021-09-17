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
                    optionElement.id="modal-option-new";
                    optionElement.title = "Cambiar el texto para todos";
                    optionElement.innerHTML = '<i class="fas fa-sync-alt"></i>';
                    optionElement.addEventListener("click", () => {
                        // enable init button
                        document.getElementById("modal-option-init").disabled = false;
                        // disable buttons
                        document.getElementById("modal-option-pause").disabled = true;
                        document.getElementById("modal-option-stop").disabled = true;
                        
                        // remove class .target from each button
                        this.elements.optionsContainer.querySelectorAll("button").forEach(button=>{
                            button.classList.remove("target");
                        })
                        optionElement.classList.add("target");
                    });
                    break;
                case "init":
                    optionElement.id="modal-option-init";
                    optionElement.title = "Iniciar";
                    optionElement.innerHTML = '<i class="fas fa-play-circle"></i>';
                    optionElement.addEventListener("click", () => {
                        // enable buttons
                        document.getElementById("modal-option-pause").disabled = false;
                        document.getElementById("modal-option-stop").disabled = false;

                        this.elements.optionsContainer.querySelectorAll("button").forEach(button=>{
                            button.classList.remove("target");
                        })
                        optionElement.classList.add("target");
                    });
                    break;
                case "pause":
                    optionElement.id="modal-option-pause";
                    optionElement.title = "Pausar";
                    optionElement.innerHTML = '<i class="fas fa-pause-circle"></i>';
                    optionElement.disabled = true;
                    optionElement.addEventListener("click", () => {
                        this.elements.optionsContainer.querySelectorAll("button").forEach(button=>{
                            button.classList.remove("target");
                        })
                        optionElement.classList.add("target");
                    });
                    break;
                case "stop":
                    optionElement.id="modal-option-stop";
                    optionElement.title = "Detener";
                    optionElement.innerHTML = '<i class="fas fa-stop-circle"></i>';
                    optionElement.disabled = true;
                    optionElement.addEventListener("click", () => {
                        // disable buttons
                        document.getElementById("modal-option-init").disabled = true;
                        document.getElementById("modal-option-pause").disabled = true;

                        this.elements.optionsContainer.querySelectorAll("button").forEach(button=>{
                            button.classList.remove("target");
                        })
                        optionElement.classList.add("target");
                    });
                    break;
            }

            fragment.appendChild(optionElement);
        });

        return fragment;
    }
}