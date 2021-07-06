const Text = {
    init() {
        // fill use-content-text
        var placeHolderInput = document.querySelector('.use-content-text');
        var writeInput = document.querySelector('.use-keyboard-input');
        //var text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus culpa et quod reiciendis ullam sit aperiam libero laboriosam error distinctio repellendus omnis, quos perferendis facere sed! Minus fuga molestiae magni?";
        var text = "Lorem";
        // disable for copy and paste
        writeInput.readOnly = "true";
        placeHolderInput.readOnly= "true";
        placeHolderInput.innerHTML = text;

        this.compareTo(placeHolderInput, writeInput.value);
    },

    // compare placeHolderInput and WriteInput 
    compareTo(placeHolderInput, writeInput){
        var resultToCompare = placeHolderInput.value.localeCompare(writeInput);
        var writeInputLenght = writeInput.length;
        var nextWord = placeHolderInput.innerHTML.charAt(writeInputLenght);
        var cardText = document.querySelector('.card-text');
        var keyboardKey = document.querySelectorAll(".keyboard__key"); 
        var alert = document.getElementById('alert'); 

        var okNextWord = false;
        
        if(writeInput.slice(-1)==placeHolderInput.innerHTML.charAt(writeInputLenght - 1)){
            if(writeInputLenght!=0){
                keyboardKey.forEach(key => {
                    if(key.innerText == writeInput.slice(-1).toLowerCase() || key.innerText == writeInput.slice(-1).toUpperCase()){
                        okNextWord = true;
                        cardText.innerHTML="La siguiente letra es: <p>"+nextWord+"</p>";
                        this._coloringPendingKey(nextWord);
                    }
                });
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

        // session ends when you complete all words successfully
        if(resultToCompare==0){
            placeHolderInput.classList.toggle("sucess");
            setTimeout(function() {
                Keyboard.close();
                alert.innerHTML="<strong>¡Muy bien!</strong> Has completado la sesión";
                alert.style="display:block";
                placeHolderInput.classList.toggle("sucess");
            }, 200);
        }
        return okNextWord;
    },

    _coloringPendingKey(letra){
        var keyboardKey = document.querySelectorAll(".keyboard__key");   
        keyboardKey.forEach(key => {
            // add color to key 'shift' when 'letra' is on LowerCase
            if(letra!=letra.toLowerCase() && key.innerText=="keyboard_arrow_up" && Keyboard.properties.capsLock==false){
                key.classList.add("keyboard__key--pending");
                Keyboard.properties.shiftPending=true;
            }

            // add color to the key which represents next word to type 
            if(key.innerText.toLowerCase()==letra.toLowerCase()){
                key.classList.add("keyboard__key--pending");
                keyboardKey.length = 0;
            }
        });
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Text.init();
});