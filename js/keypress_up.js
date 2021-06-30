const KeypressUp = {
    init(e) {  
        const keyboardKey = document.querySelectorAll(".keyboard__key");
        if(e.keyCode==16){ // shift
            e.preventDefault();
            keyboardKey.forEach(key => {
                if(key.innerText=="keyboard_arrow_up"){
                    key.classList.remove("active");
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