const KeypressUp = {
    init(e) {  
        if(e.keyCode==16){ // shift
            document.querySelectorAll(".keyboard__key").forEach(key => {
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
                }
            });
        }  
    }
};

window.addEventListener('keyup', function(e){
    KeypressUp.init(e);
}, true);