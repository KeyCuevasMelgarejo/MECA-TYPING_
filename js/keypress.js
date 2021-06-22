const Keypress = {
    init(e) {  
        // Detect esc key and close keyboard     
        if(e.key=='Escape'|| e.key=='Esc'|| e.keyCode==27){
            e.preventDefault();
            Keyboard.close();
            // remove the focus and continue clicking on it to show keyboard again
            document.getElementById("content").blur();
        }else if(e.keyCode==32){
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
        }else if(e.keyCode==13){
            document.querySelectorAll(".keyboard__key").forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText=="keyboard_return"){
                    key.addEventListener("click",function(){
                        key.classList.add("keypress");
                    });
                    key.dispatchEvent(new Event("click"));
                }
            });
        }else if(e.keyCode==16 || e.keyCode==20){
            document.querySelectorAll(".keyboard__key").forEach(key => {
                key.classList.remove("keypress");
                if(key.innerText=="keyboard_capslock"){
                    key.addEventListener("click",function(){
                        key.classList.add("keypress");
                    });
                    key.dispatchEvent(new Event("click"));
                }

            });
        }else{
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
    Keypress.init(e);
}, true);