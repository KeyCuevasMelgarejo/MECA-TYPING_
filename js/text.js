const Text = {
    init() {
        // fill use-content-text
        var placeHolderInput = document.querySelector('.use-content-text');
        var writeInput = document.querySelector('.use-keyboard-input');
        // var text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus culpa et quod reiciendis ullam sit aperiam libero laboriosam error distinctio repellendus omnis, quos perferendis facere sed! Minus fuga molestiae magni?";
        var text = "Lorem\nipsum dolor sit amet consectetur\nadipisicing elit.";
        // disable for copy and paste
        writeInput.readOnly = "true";
        placeHolderInput.readOnly= "true";
        placeHolderInput.innerHTML = text;

        this.compareText(placeHolderInput, writeInput.value);
    },

    // for characters
    // compare placeHolderInput and WriteInput 
    compareText(placeHolderInput, writeInput){
        var writeInputLenght = writeInput.length;
        var nextWord = placeHolderInput.innerHTML.charAt(writeInputLenght);
        var previousWord = placeHolderInput.innerHTML.charAt(writeInputLenght-1);
        var cardText = document.querySelector('.card-text');
        var alert = document.getElementById('alert'); 

        var okNextWord = false;

        console.log(nextWord);
        
        if(writeInput.slice(-1)==placeHolderInput.innerHTML.charAt(writeInputLenght - 1)){
            if(writeInputLenght!=0){
                var resultToCompare = placeHolderInput.value.localeCompare(writeInput);

                okNextWord = true;
                cardText.innerHTML="La siguiente letra es: <p>"+nextWord+"</p>";
                this._decoloringPreviousKey(previousWord);
                this._coloringPendingKey(nextWord);

                // session ends when you complete all words successfully
                if(resultToCompare==0){
                    placeHolderInput.classList.toggle("sucess");
                    // message after complete the session correctly
                    alert.querySelector("div").innerHTML='<strong>¡Muy bien!</strong> Has completado la sesión';
                    alert.style="display:block";
                    // indicator change message
                    cardText.innerHTML="La siguiente letra es: <p>(Vacío)</p>";
                    setTimeout(function() {
                        Keyboard.close();
                        placeHolderInput.classList.toggle("sucess");
                    }, 200);
                }
            }else{
                cardText.innerHTML="La siguiente letra es: <p>"+nextWord+"</p>";
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
        var previousColoredWord = placeHolderInput.innerHTML.charAt(writeInputLenght+1);
        var previousWord = placeHolderInput.innerHTML.charAt(writeInputLenght);
        var cardText = document.querySelector('.card-text');
        
        cardText.innerHTML="La siguiente letra es: <p>"+previousWord+"</p>";
        this._decoloringPreviousKey(previousColoredWord);
        this._coloringPendingKey(previousWord);
    },

    // for erase
    removeAllText(placeHolderInput){
        var previousWord = placeHolderInput.innerHTML.charAt(0);
        var cardText = document.querySelector('.card-text');
        var keyboardKey = document.querySelectorAll(".keyboard__key"); 
        
        cardText.innerHTML="La siguiente letra es: <p>"+previousWord+"</p>";

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
            if(key.innerText=="space_bar" && letra==" "){
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
            if(key.innerText=="space_bar" && letra==" "){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
            }else if(key.innerText.toLowerCase()==letra.toLowerCase()){
                key.classList.remove("keyboard__key--pending");
                keyboardKey.length = 0;
            }
        });
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Text.init();
});