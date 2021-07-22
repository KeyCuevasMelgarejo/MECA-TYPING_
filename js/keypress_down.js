const KeypressDown = {
    init(e) { 
        var keyboardKey = document.querySelectorAll(".keyboard__key");  
        // when press  a key, show keyboard
        writeInput.dispatchEvent(new Event("focus"));  

        // clic-zone disappear
        document.querySelector(".clic-zone").classList.add("hidden");
        placeHolderInput.classList.add("fadedOut");
        
        if(e.key=='Escape'|| e.key=='Esc'|| e.keyCode==27){ // detect esc key and close keyboard 
            this._reSetupEvent(e,keyboardKey,"keypress","visibility_off");

            // remove the focus and allow clicking on it to show keyboard again
            writeInput.blur();
        }else if(e.keyCode==32){ // space bar
            this._reSetupEvent(e,keyboardKey,"keypress","space_bar");
        }else if(e.keyCode==13){ // enter
            this._reSetupEvent(e,keyboardKey,"keypress","keyboard_return");
        }else if(e.keyCode==20){ // bloq mayus
            this._reSetupEvent(e,keyboardKey,"keypress","keyboard_capslock");
        }else if(e.keyCode==16){ // shift
            e.preventDefault();
            keyboardKey.forEach(key => {
                if(key.innerText=="keyboard_arrow_up"){
                    key.classList.add("active");
                    key.dispatchEvent(new Event("click"));
                    keyboardKey.length = 0;
                }
            });
        }else if(e.keyCode==46){ // supr erase all
            this._reSetupEvent(e,keyboardKey,"suprkeypress","delete");
        }else if(e.keyCode==222){ // tilde '´'
            this._reSetupEvent(e,keyboardKey,"keypress","´");
        }else{ //numers, letters and backspace
            keyboardKey.forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText == e.key.toLowerCase() || key.innerText == e.key.toUpperCase()){
                    e.preventDefault();
                    key.addEventListener("click",function(){
                        key.classList.add("keypress");
                    });     
                    key.dispatchEvent(new Event("click"));
                }
            });
        }
    },

    _reSetupEvent(_e,_keyboardKey,_class,_innerText){
        _e.preventDefault();
        // Automatically use keyboard for elements with .use-keyboard-input
        _keyboardKey.forEach(key => {
            // A1.this remove class keypress, and looks like :hover effect ...keyboard.js part A2
            key.classList.remove(_class);
            if(key.innerText==_innerText){
                 // Dispatch/Trigger/Fire the event
                key.dispatchEvent(new Event("click"));
                // Break out of the loop by truncating array
                _keyboardKey.length = 0;
            }
        });
    }
};

window.addEventListener('keydown', function(e){
    KeypressDown.init(e);
}, true);