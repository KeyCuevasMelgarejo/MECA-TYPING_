const KeypressUp = {
    init(e) {  
        const keyboardKey = document.querySelectorAll(".keyboard__key");
        if(e.keyCode==16){ // shift
            e.preventDefault();
            keyboardKey.forEach(key => {
                // change key values, sign to numeric
                if(key.innerText=="!"){
                    key.textContent="1";
                    key.value="1";
                }

                if(key.innerText=="keyboard_arrow_up"){
                    key.addEventListener("click",function(){
                        key.classList.remove("active");
                    });
                    key.dispatchEvent(new Event("click"));
                    keyboardKey.length = 0;
                }
            });
        }  
    }
};

window.addEventListener('keyup', function(e){
    KeypressUp.init(e);
}, true);