const KeypressDown = {
    init(e) {  
        // Detect esc key and close keyboard     
        if(e.key=='Escape'|| e.key=='Esc'|| e.keyCode==27){
            e.preventDefault();
            Keyboard.close();
            // remove the focus and continue clicking on it to show keyboard again
            document.getElementById("content").blur();
        }else if(e.keyCode==32){ // space bar
            // Automatically use keyboard for elements with .use-keyboard-input
            document.querySelectorAll(".keyboard__key").forEach(key => {
                // 1.this remove class keypress, and looks like :hover effect 
                key.classList.remove("keypress");
                if(key.innerText=="space_bar"){
                    // Dispatch/Trigger/Fire the event
                    key.addEventListener("click",function(){
                        // 2.the unique way to create effect after press and change color
                        // pseudoclasses like :active :hover are not accepted, that why i created @keyframes on style.css
                        key.classList.add("keypress");
                    });
                    key.dispatchEvent(new Event("click"));
                }
            });
        }else if(e.keyCode==13){ // enter
            document.querySelectorAll(".keyboard__key").forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText=="keyboard_return"){
                    key.addEventListener("click",function(){
                        key.classList.add("keypress");
                    });
                    key.dispatchEvent(new Event("click"));
                }
            });
        }else if(e.keyCode==20){ // bloq mayus
            document.querySelectorAll(".keyboard__key").forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText=="keyboard_capslock"){
                    key.addEventListener("click",function(){
                        key.classList.add("keypress");
                    });
                    key.dispatchEvent(new Event("click"));
                }

            });
        }else if(e.keyCode==16){ // shift
            document.querySelectorAll(".keyboard__key").forEach(key => {
                if(key.innerText=="keyboard_arrow_up"){
                    key.addEventListener("click",function(){
                        key.classList.add("active");
                    });
                    key.dispatchEvent(new Event("click"));
                }

            });
        }else if(e.keyCode==46){ // supr erase all
            document.querySelectorAll(".keyboard__key").forEach(key => {
                key.classList.remove("suprkeypress");
                if(key.innerText=="delete"){
                    key.addEventListener("click",function(){
                        key.classList.add("suprkeypress");
                    });
                    key.dispatchEvent(new Event("click"));
                }

            });
        }else{ //numers, letters and backspace
            document.querySelectorAll(".keyboard__key").forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText == e.key.toLowerCase() || key.innerText == e.key.toUpperCase()){
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