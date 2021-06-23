const Events = {
    init() {        
        var alerta = document.getElementById('alert');
        var textContent = document.getElementById('textcontent');
        var btnLimpiar = document.querySelector('.btn-limpiar');
        var textKeyboardInput = document.querySelector('.use-keyboard-input');
        var btnCloseAlert = document.getElementById('btn-close-alert');

        alerta.style="display:none";

        // if you clic out of use-keyboard-input then close keyboard
        textContent.onclick = function(e) {
            e.preventDefault();
            Keyboard.close();
        }

        // you can't copy and paste from text
        textContent.onpaste = function(e) {
            e.preventDefault();
            alerta.style="display:block";
            Keyboard.close();
        }
        textContent.oncopy = function(e) {
            e.preventDefault();
            alerta.style="display:block";
            Keyboard.close();
        }

        // you try to copy or paste show a message and then you can close it
        btnCloseAlert.onclick=function(e){
            e.preventDefault();
            alerta.style.display="none";
        }

        // clear use-keyboard-input textarea
        btnLimpiar.onclick=function(e){
            e.preventDefault();
            textKeyboardInput.value="";
        }

    }
};

window.addEventListener("DOMContentLoaded", function () {
    Events.init();
});