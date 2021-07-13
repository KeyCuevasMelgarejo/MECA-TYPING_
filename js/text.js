const Text = {
    init() {
        // var text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus culpa et quod reiciendis ullam sit aperiam libero laboriosam error distinctio repellendus omnis, quos perferendis facere sed! Minus fuga molestiae magni?";
        var text = "Lorem ipsum dolor sit\namet consectetur, adipisicing elit.\nNecessitatibus";
        //var text="a b c d e f g h i j k l m n o p q r s t u v w y x z , ."
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
        var fingers = document.querySelectorAll("circle");

        this._specialWordsIndicateTop(previousWord);

        //remove all pendingColors
        keyboardKey.forEach(key => {
            key.classList.remove("keyboard__key--pending");
        });

        //remove all pendingColors finger
        fingers.forEach(finger => {
            Hands.fingerReturn("."+finger.className.animVal);
        });

        this._coloringPendingKey(previousWord);
    },

    undo(placeHolderInput,writeInput){
        var writeInputLenght = writeInput.length;
        var previousWord = (placeHolderInput.innerHTML.charAt(writeInputLenght) && placeHolderInput.innerHTML[writeInputLenght].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght));
        var keyboardKey = document.querySelectorAll(".keyboard__key"); 
        var fingers = document.querySelectorAll("circle");

        this._specialWordsIndicateTop(previousWord);
        
        //remove all pendingColors key
        keyboardKey.forEach(key => {
            key.classList.remove("keyboard__key--pending");
        });

        //remove all pendingColors finger
        fingers.forEach(finger => {
            Hands.fingerReturn("."+finger.className.animVal);
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
                Hands.fingerAnimation(".meniqueR");
            }

            // add color to the key which represents next word to type 
            if(key.innerText=="keyboard_return" && letra=='\\n'){
                key.classList.add("keyboard__key--pending");
                keyboardKey.length = 0;
                Hands.fingerAnimation(".meniqueR");
            }else if(key.innerText=="space_bar" && letra==" "){
                key.classList.add("keyboard__key--pending");
                keyboardKey.length = 0;
                Hands.fingerAnimation(".gordoR");
            }else if(key.innerText.toLowerCase()==letra.toLowerCase()){
                key.classList.add("keyboard__key--pending");
                keyboardKey.length = 0;
                this._activeAnimation(letra.toLowerCase());
            }
        });
    },

    _decoloringPreviousKey(letra){
        var keyboardKey = document.querySelectorAll(".keyboard__key");   
        keyboardKey.forEach(key => {
            // add color to 'shift' key when 'letra' is on LowerCase
            if(letra==letra.toUpperCase() && key.innerText=="keyboard_arrow_up"){
                key.classList.remove("keyboard__key--pending");
                Keyboard.properties.shiftPending=false;
                Hands.fingerReturn(".meniqueR");
            }

            // add color to the key which represents next word to type 
            if(key.innerText=="keyboard_return" && letra=='\\n'){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
                Hands.fingerReturn(".meniqueR");
            }else if(key.innerText=="space_bar" && letra==" "){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
                Hands.fingerReturn(".gordoR");
            }else if(key.innerText.toLowerCase()==letra.toLowerCase()){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
                this._inactiveAnimation(letra.toLowerCase());
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
    },

    _activeAnimation(word){
        switch (word) {
            case "1": case "q": case "a": case "z": case "!":
                Hands.fingerAnimation(".meniqueL");
                break;
            case "2": case "w": case "s": case "x":
                Hands.fingerAnimation(".anularL");
                break;
            case "3": case "e": case "d": case "c":
                Hands.fingerAnimation(".medioL");
                break;
            case "4": case "r": case "f": case "v":
                Hands.fingerAnimation(".indiceL");
                break;
            case "5": case "t": case "g": case "b":
                Hands.fingerAnimation(".indiceL");
                break;
            case "6": case "y": case "h": case "n":
                Hands.fingerAnimation(".indiceR");
                break;
            case "7": case "u": case "j": case "m":
                Hands.fingerAnimation(".indiceR");
                break;
            case "8": case "i": case "k": case ",":
                Hands.fingerAnimation(".medioR");
                break;
            case "9": case "o": case "l": case ".":
                Hands.fingerAnimation(".anularR");
                break;
            case "0": case "p": case "ñ":
                Hands.fingerAnimation(".meniqueR");
                break;
        }
    },

    _inactiveAnimation(word){
        switch (word) {
            case "1": case "q": case "a": case "z": case "!":
                Hands.fingerReturn(".meniqueL");
                break;
            case "2": case "w": case "s": case "x":
                Hands.fingerReturn(".anularL");
                break;
            case "3": case "e": case "d": case "c":
                Hands.fingerReturn(".medioL");
                break;
            case "4": case "r": case "f": case "v":
                Hands.fingerReturn(".indiceL");
                break;
            case "5": case "t": case "g": case "b":
                Hands.fingerReturn(".indiceL");
                break;
            case "6": case "y": case "h": case "n":
                Hands.fingerReturn(".indiceR");
                break;
            case "7": case "u": case "j": case "m":
                Hands.fingerReturn(".indiceR");
                break;
            case "8": case "i": case "k": case ",":
                Hands.fingerReturn(".medioR");
                break;
            case "9": case "o": case "l": case ".":
                Hands.fingerReturn(".anularR");
                break;
            case "0": case "p": case "ñ":
                Hands.fingerReturn(".meniqueR");
                break;
        }
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Text.init();
});