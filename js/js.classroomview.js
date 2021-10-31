// about teacher

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
        this.elements.studentsContainer.appendChild(this._createStudents());
        this.elements.optionsContainer.classList.add("modal-classroomview__options");
        this.elements.optionsContainer.appendChild(this._createOptions());

        // Add to DOM as first element on body
        this.elements.main.appendChild(this.elements.studentsContainer);
        this.elements.main.appendChild(this.elements.optionsContainer);
        document.querySelector(".modal-content").insertBefore(this.elements.main, document.querySelector(".modal-content").lastChild);
    },

    _createStudents(){
        const studentsContainer=document.createElement("ul");
        let studentsCountLabel=document.createElement("p");
        let studentsCount=0;

        studentsContainer.id="students-container";
        studentsCountLabel.id="students-count";

        studentsCountLabel.innerHTML="<strong></strong> estudiantes conectados";

        socket.on("join-new-student", function(data) {
            const newStudent=document.createElement("li");
            newStudent.id=data[0];
            newStudent.innerHTML=data[1];

            studentsContainer.querySelectorAll("li").forEach(student=>{
                if(student.id==data[0]){
                    studentsContainer.removeChild(student);
                    studentsContainer.length=0;

                    studentsCount--;
                }
            })
            
            studentsCount++;

            studentsCountLabel.querySelector("strong").textContent=studentsCount;

            if(studentsContainer.querySelectorAll("li").length==0){
                studentsContainer.appendChild(studentsCountLabel);
            }
        
            studentsContainer.appendChild(newStudent);
        });

        socket.on("student-disconnected", function(data) {
            studentsContainer.querySelectorAll("li").forEach(student=>{
                if(student.id==data){
                    studentsContainer.removeChild(student);
                    studentsContainer.length=0;

                    studentsCount--;
                }
            })

            studentsCountLabel.querySelector("strong").textContent=studentsCount;

            if(studentsContainer.querySelectorAll("li").length==0){
                studentsContainer.removeChild(studentsCountLabel);
            }
        });

        socket.on("resume", function(data) {
            let studentAttr;
            data.forEach(students=>{
                studentAttr= Object.values(students)[0];
                document.getElementById(Object.keys(students)).innerHTML=studentAttr.name+" [ Tiempo: "+studentAttr.time+" - Nota: "+studentAttr.qualification+" ]";
            });
        });

        return studentsContainer;
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

                        // send order to BACKEND
                        new Promise(resolve => {
                            Text.reinit();
                            setTimeout(() => resolve("done!"), 500)
                        }).then(()=>{
                            socket.emit("new",placeHolderInput.value,PIN);
                        });
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

                        // send order to BACKEND
                        socket.emit("init",PIN);
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

                        // send order to BACKEND
                        socket.emit("pause",PIN);
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

                        // send order to BACKEND
                        socket.emit("stop",PIN);
                    });
                    break;
            }

            fragment.appendChild(optionElement);
        });

        return fragment;
    }
}