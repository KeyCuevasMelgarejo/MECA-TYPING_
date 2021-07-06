const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        shift: false,
        shiftPending: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;                    
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "?", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", 
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "z", "x", "c", "v", "b", "n", "m", ",", ".", "shift",
            "done", "space", "erase", "undo"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");

            // this line means, ghaphicaly on keyboard, which keys delimit each row 
            const insertLineBreak = ["backspace", "p", "enter", "shift"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--backspace");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        //this means: document.querySelector('.use-keyboard-input').value=
                        this._triggerEvent("oninput");

                        saveMemento(); // from keypress_undo.js
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        keyElement.classList.add("keypress");

                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });
                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--shift");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_up");

                    keyElement.addEventListener("click", () => {
                        this._toggleShift();
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");

                        keyElement.classList.add("keypress");

                        saveMemento(); // from keypress_undo.js
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");

                        // A2.the unique way to create effect after press and change color
                        // pseudoclasses like :active :hover are not accepted, that why i created @keyframes on style.css
                        // ...keypress_down.js part A1
                        keyElement.classList.add("keypress");

                        saveMemento(); // from keypress_undo.js
                    });
                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("visibility_off");

                    keyElement.addEventListener("click", () => {                  
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;

                case "erase":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("delete");

                    keyElement.addEventListener("click", () => {
                        this.properties.value="";
                        this._triggerEvent("oninput");

                        keyElement.classList.add("suprkeypress");

                        saveMemento(); // from keypress_undo.js
                    });
                    break;

                case "undo":
                    keyElement.classList.add("keyboard__key--undo", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("undo");

                    keyElement.addEventListener("click", () => {
                        undo(); // from keypress_undo.js

                        this._triggerEvent("oninput");
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        if(key=="1"){
                            this.properties.value += this.properties.shift ? "!": "1";
                        }else if(key=="!"){
                            this.properties.value += this.properties.shift ? "1": "!";
                        }else{
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        }

                        if(this._toggleCompareText(this.properties.value)){
                            this._triggerEvent("oninput");
                            saveMemento(); // from keypress_undo.js
                        }else{
                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        }
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }else if(key.textContent=="keyboard_arrow_up"){
                // when next word needs to press 'shift' but press 'BloqMayus', obviously must remove #3CD2E6 color and viceverse
                if(this.properties.capsLock==true){
                    key.classList.remove("keyboard__key--pending");
                }else if(this.properties.capsLock==false && this.properties.shiftPending==true){
                    key.classList.add("keyboard__key--pending");
                }
            }
        }
    },

    _toggleShift() {
        this.properties.capsLock = !this.properties.capsLock;
        this.properties.shift = !this.properties.shift;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                if(key.textContent=="1"){
                    key.textContent = "!";
                }else if(key.textContent=="!"){
                    key.textContent = "1";
                }else{
                    key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                }
            }
        }
    },

    _toggleCompareText(wordInserted) {
        var placeHolderInput = document.querySelector('.use-content-text');

        return Text.compareTo(placeHolderInput, wordInserted);
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");

        Hands.open();
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");

        Hands.close();
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});