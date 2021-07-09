const Text = {
    init() {
        // var text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus culpa et quod reiciendis ullam sit aperiam libero laboriosam error distinctio repellendus omnis, quos perferendis facere sed! Minus fuga molestiae magni?";
        var text = "Lorem\ni";
        // disable for copy and paste
        writeInput.readOnly = "true";
        placeHolderInput.readOnly= "true";
        // fill use-content-text
        placeHolderInput.innerHTML = text;

        this.compareText(placeHolderInput, writeInput.value);

        saveMemento();
    },

    // for characters
    // compare placeHolderInput and WriteInput 
    compareText(placeHolderInput, writeInput){
        var writeInputLenght = writeInput.length;
        // on 'enter' key case asign '\n', in other way, a 'character'
        var nextWord = (placeHolderInput.innerHTML.charAt(writeInputLenght) && placeHolderInput.innerHTML[writeInputLenght].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght));
        var previousWord = (placeHolderInput.innerHTML.charAt(writeInputLenght-1) && placeHolderInput.innerHTML[writeInputLenght-1].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght-1));

        var okNextWord = false;
        
        if(writeInput.slice(-1)==placeHolderInput.innerHTML.charAt(writeInputLenght - 1)){
            if(writeInputLenght!=0){
                var resultToCompare = placeHolderInput.value.localeCompare(writeInput);

                okNextWord = true;

                // some special cases
                this._specialWordsIndicateTop(nextWord);
          
                this._decoloringPreviousKey(previousWord);
                this._coloringPendingKey(nextWord);

                // session ends when you complete all words successfully
                if(resultToCompare==0){
                    placeHolderInput.classList.toggle("sucess");
                    // message after complete the session correctly
                    alerta.querySelector("div").innerHTML='<strong>¡Muy bien!</strong> Has completado la sesión';
                    alerta.style="display:block";
                    
                    this._specialWordsIndicateTop(null);
                    setTimeout(function() {
                        Keyboard.close();
                        placeHolderInput.classList.toggle("sucess");
                    }, 200);
                }
            }else{
                this._specialWordsIndicateTop(nextWord);
                this._coloringPendingKey(nextWord);
            }
        }else{  
            // that's my solution to toggle, remove and toggle again after error
            placeHolderInput.classList.toggle("error");
            setTimeout(function() {
                placeHolderInput.classList.toggle("error");
            }, 200);
        }

        return okNextWord;
    },

    // for backspace
    removeText(placeHolderInput, writeInput){
        var writeInputLenght = writeInput.length;
        var previousColoredWord = (placeHolderInput.innerHTML.charAt(writeInputLenght+1) && placeHolderInput.innerHTML[writeInputLenght+1].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght+1));
        var previousWord = (placeHolderInput.innerHTML.charAt(writeInputLenght) && placeHolderInput.innerHTML[writeInputLenght].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght));

        this._specialWordsIndicateTop(previousWord);
        this._decoloringPreviousKey(previousColoredWord);
        this._coloringPendingKey(previousWord);
    },

    // for erase
    removeAllText(placeHolderInput){
        var previousWord = placeHolderInput.innerHTML.charAt(0);
        var keyboardKey = document.querySelectorAll(".keyboard__key"); 
        
        this._specialWordsIndicateTop(previousWord);

        //remove all pendingColors
        keyboardKey.forEach(key => {
            key.classList.remove("keyboard__key--pending");
        });

        this._coloringPendingKey(previousWord);
    },

    undo(placeHolderInput,writeInput){
        var writeInputLenght = writeInput.length;
        var previousWord = (placeHolderInput.innerHTML.charAt(writeInputLenght) && placeHolderInput.innerHTML[writeInputLenght].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght));
        var keyboardKey = document.querySelectorAll(".keyboard__key"); 

        this._specialWordsIndicateTop(previousWord);
        
        //remove all pendingColors
        keyboardKey.forEach(key => {
            key.classList.remove("keyboard__key--pending");
        });

        this._coloringPendingKey(previousWord);
    },

    _coloringPendingKey(letra){
        var keyboardKey = document.querySelectorAll(".keyboard__key");   
        keyboardKey.forEach(key => {
            // add color to 'shift' key when 'letra' is on LowerCase
            if(letra!=letra.toLowerCase() && key.innerText=="keyboard_arrow_up" && Keyboard.properties.capsLock==false){
                key.classList.add("keyboard__key--pending");
                Keyboard.properties.shiftPending=true;
            }

            // add color to the key which represents next word to type 
            if(key.innerText=="keyboard_return" && letra=='\\n'){
                key.classList.add("keyboard__key--pending");
                keyboardKey.length = 0;
            }else if(key.innerText=="space_bar" && letra==" "){
                key.classList.add("keyboard__key--pending");
                keyboardKey.length = 0;
            }else if(key.innerText.toLowerCase()==letra.toLowerCase()){
                key.classList.add("keyboard__key--pending");
                keyboardKey.length = 0;
            }
        });
    },

    _decoloringPreviousKey(letra){
        var keyboardKey = document.querySelectorAll(".keyboard__key");   
        keyboardKey.forEach(key => {
            // add color to 'shift' key when 'letra' is on LowerCase
            if(key.innerText=="keyboard_arrow_up"){
                key.classList.remove("keyboard__key--pending");
                Keyboard.properties.shiftPending=false;
            }

            // add color to the key which represents next word to type 
            if(key.innerText=="keyboard_return" && letra=='\\n'){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
            }else if(key.innerText=="space_bar" && letra==" "){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
            }else if(key.innerText.toLowerCase()==letra.toLowerCase()){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
            }
        });
    },

    _specialWordsIndicateTop(word){
        var cardText = document.querySelector('.card-text');
        switch (word){
            case "\\n":
                cardText.innerHTML="La siguiente letra es: <p>[Enter]</p>";
                break;
            case " ":
                cardText.innerHTML="La siguiente letra es: <p>[Espacio]</p>";
                break;
            case null:
                cardText.innerHTML="La siguiente letra es: <p>-Vacío-</p>";
                break;
            default:
                cardText.innerHTML="La siguiente letra es: <p>"+word+"</p>";
                break;
        }
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Text.init();
});