const KeypressDown = {
    init(e) { 
        const keyboardKey = document.querySelectorAll(".keyboard__key");
        // Detect esc key and close keyboard     
        if(e.key=='Escape'|| e.key=='Esc'|| e.keyCode==27){
            e.preventDefault();
            Keyboard.close();
            // remove the focus and continue clicking on it to show keyboard again
            document.getElementById("content").blur();
        }else if(e.keyCode==32){ // space bar
            e.preventDefault();
            // Automatically use keyboard for elements with .use-keyboard-input
            keyboardKey.forEach(key => {
                // A1.this remove class keypress, and looks like :hover effect ...keyboard.js part A2
                key.classList.remove("keypress");
                if(key.innerText=="space_bar"){
                    // Dispatch/Trigger/Fire the event
                    key.dispatchEvent(new Event("click"));
                    // Break out of the loop by truncating array
                    keyboardKey.length = 0;
                }
            });
        }else if(e.keyCode==13){ // enter
            e.preventDefault();
            keyboardKey.forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText=="keyboard_return"){
                    key.dispatchEvent(new Event("click"));
                    keyboardKey.length = 0;
                }
            });
        }else if(e.keyCode==20){ // bloq mayus
            e.preventDefault();
            keyboardKey.forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText=="keyboard_capslock"){
                    key.dispatchEvent(new Event("click"));
                    keyboardKey.length = 0;
                }
            });
        }else if(e.keyCode==16){ // shift
            e.preventDefault();
            keyboardKey.forEach(key => {
                // change key values, numeric to sign
                if(key.innerText=="1"){     
                    key.textContent="!";
                    key.value="!";
                }
                if(key.innerText=="keyboard_arrow_up"){
                    key.addEventListener("click",function(){
                        key.classList.add("active");
                    });
                    key.dispatchEvent(new Event("click"));
                    keyboardKey.length = 0;
                }
            });
        }else if(e.keyCode==46){ // supr erase all
            e.preventDefault();
            keyboardKey.forEach(key => {
                key.classList.remove("suprkeypress");
                if(key.innerText=="delete"){
                    key.dispatchEvent(new Event("click"));
                    keyboardKey.length = 0;
                }
            });
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
    }
};

window.addEventListener('keydown', function(e){
    KeypressDown.init(e);
}, true);