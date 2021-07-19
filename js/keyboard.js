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
        shiftPending: false,
        escapeChain: false
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
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "´", "enter",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ",
            "z", "x", "c", "v", "b", "n", "m", ",", ".", "-", "shift",
            "done", "space", "erase", "undo"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");

            // this line means, ghaphicaly on keyboard, which keys delimit each row 
            const insertLineBreak = ["backspace", "enter", "ñ", "shift"].indexOf(key) !== -1;

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

                        this._triggerRemoveText(this.properties.value);
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        // A2.the unique way to create effect after press and change color
                        // pseudoclasses like :active :hover are not accepted, that why i created @keyframes on style.css
                        // ...keypress_down.js part A1
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
                    keyElement.classList.add("keyboard__key--enter");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";

                        keyElement.classList.add("keypress");

                        if(this._triggerCompareText(this.properties.value)){
                            this._triggerEvent("oninput");
                            saveMemento();
                        }else{
                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        }
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";

                        keyElement.classList.add("keypress");

                        if(this._triggerCompareText(this.properties.value)){
                            this._triggerEvent("oninput");
                            saveMemento();
                        }else{
                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        }
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

                        this._triggerRemoveAllText();
                    });
                    break;

                case "undo":
                    keyElement.classList.add("keyboard__key--undo", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("undo");

                    keyElement.addEventListener("click", () => {
                        const lastMemento = mementos.pop();
                        this.properties.value=lastMemento ? lastMemento : "";

                        this._triggerEvent("oninput");

                        this._triggerUndo(this.properties.value);
                    });
                    break;

                case "´":
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        keyElement.classList.add("keypress");
                        this.properties.escapeChain=true;
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        // add a word to properties.value according capsLock or shift press
                        this._evaluateCommonKeyPressed(key);

                        // if key pressed is equals to next pending word, procede
                        if(this._triggerCompareText(this.properties.value)){
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
                switch(key.textContent){
                    case "1": case "!":
                        key.textContent = key.textContent=="1" ? key.textContent="!" : key.textContent="1";break;
                    case "2": case "\"":
                        key.textContent = key.textContent=="2" ? key.textContent="\"" : key.textContent="2";break;
                    case "8": case "\(":
                        key.textContent = key.textContent=="8" ? key.textContent="\(" : key.textContent="8";break;
                    case "9": case "\)":
                        key.textContent = key.textContent=="9" ? key.textContent="\)" : key.textContent="9";break;
                    case ",": case "\;":
                        key.textContent = key.textContent=="," ? key.textContent="\;" : key.textContent=",";break;
                    case ".": case "\:":
                        key.textContent = key.textContent=="." ? key.textContent="\:" : key.textContent=".";break;
                    case "-": case "\_":
                        key.textContent = key.textContent=="-" ? key.textContent="\_" : key.textContent="-";break;
                    default:
                        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();break;
                }
            }
        }
    },

    _evaluateCommonKeyPressed(key){
        switch(key){
            case "1":
                this.properties.value += this.properties.shift ? "!": "1";break;
            case "!":
                this.properties.value += this.properties.shift ? "1": "!";break;
            case "2":
                this.properties.value += this.properties.shift ? "\"": "2";break;
            case "\"":
                this.properties.value += this.properties.shift ? "2": "\"";break;
            case "8":
                this.properties.value += this.properties.shift ? "\(": "8";break;
            case "\(":
                this.properties.value += this.properties.shift ? "8": "\(";break;
            case "9":
                this.properties.value += this.properties.shift ? "\)" :"9";break;
            case "\)":
                this.properties.value += this.properties.shift ? "9": "\)";break;
            case ",":
                this.properties.value += this.properties.shift ? "\;": ",";break;
            case "\;":
                this.properties.value += this.properties.shift ? ",": "\;";break;
            case ".":
                this.properties.value += this.properties.shift ? "\:": ".";break;
            case "\:":
                this.properties.value += this.properties.shift ? ".": "\:";break;
            case "-":
                this.properties.value += this.properties.shift ? "\_": "-";break;
            case "\_":
                this.properties.value += this.properties.shift ? "-": "\_";break;
            default:
                if(this.properties.escapeChain){
                    var vocal = (/^[aeiou]$/i).test(key);
                    if(vocal==true){
                        if((/^[a]$/i).test(key)){
                            this.properties.value += this.properties.capsLock ? '\u00C1' : '\u00E1';
                        }else if((/^[e]$/i).test(key)){
                            this.properties.value += this.properties.capsLock ? '\u00C9' : '\u00E9';
                        }else if((/^[i]$/i).test(key)){
                            this.properties.value += this.properties.capsLock ? '\u00CD' : '\u00ED';
                        }else if((/^[o]$/i).test(key)){
                            this.properties.value += this.properties.capsLock ? '\u00D3' : '\u00F3';
                        }else if((/^[u]$/i).test(key)){
                            this.properties.value += this.properties.capsLock ? '\u00DA' : '\u00FA';
                        }
                        this.properties.escapeChain=false;
                    }else{
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                    }
                }else{
                    this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                }
                break;
        }
    },

    _triggerCompareText(wordInserted) {
        return Text.compareText(placeHolderInput, wordInserted);
    },

    _triggerRemoveText(wordInserted) {
        Text.removeText(placeHolderInput, wordInserted);
    },

    _triggerRemoveAllText() {
        Text.removeAllText(placeHolderInput);
    },    

    _triggerUndo(wordInserted) {
        Text.undo(placeHolderInput,wordInserted);
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

        // oposite to focus
        writeInput.blur();
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});