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
        var keyLayout=null;
        const fragment = document.createDocumentFragment();

        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
            isMobile = true;
        }

        if(isMobile){
            keyLayout = [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "¡",
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "´", 
                "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ", 
                "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-", "backspace",
                "done", "undo", "space", "erase", "enter",
            ];
        }else{
            keyLayout = [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "¡", "backspace",
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",  
                "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ", "´", "enter",
                "z", "x", "c", "v", "b", "n", "m", ",", ".", "-", "shift",
                "done", "space", "erase", "undo"
            ];
        }

        

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            var insertLineBreak=null;
            const keyElement = document.createElement("button");

            if(isMobile){
            // this line means, ghaphicaly on keyboard, which keys delimit each row 
                insertLineBreak = ["¡", "´", "ñ", "backspace"].indexOf(key) !== -1;
            }else{
                insertLineBreak = ["backspace", "p", "enter", "shift"].indexOf(key) !== -1;
            }

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
                    case "\'": case "?":
                        key.textContent = key.textContent=="\'" ? key.textContent="?" : key.textContent="\'";break;
                    case "\¡": case "¿":
                        key.textContent = key.textContent=="\¡" ? key.textContent="¿" : key.textContent="\¡";break;
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
            case "\'":
                this.properties.value += this.properties.shift ? "?" :"\'";break;
            case "?":
                this.properties.value += this.properties.shift ? "\'": "?";break;
            case "\¡":
                this.properties.value += this.properties.shift ? "¿" :"\¡";break;
            case "¿":
                this.properties.value += this.properties.shift ? "\¡": "¿";break;
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