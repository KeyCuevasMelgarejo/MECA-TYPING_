const KeypressUp = {
    init(e) {  
        if(e.keyCode==16){ // shift
            document.querySelectorAll(".keyboard__key").forEach(key => {
                if(key.innerText=="keyboard_arrow_up"){
                    key.addEventListener("click",function(){
                        key.classList.remove("active");
                    });
                    key.dispatchEvent(new Event("click"));
                }
            });
        }  
    }
};

window.addEventListener('keyup', function(e){
    KeypressUp.init(e);
}, true);