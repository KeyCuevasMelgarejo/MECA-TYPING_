const Events = {
    init() {        
        var alerta = document.getElementById('alert');
        var textContent = document.getElementById('textcontent');
        var btnLimpiar = document.querySelector('.btn-limpiar');
        var textKeyboardInput = document.querySelector('.use-keyboard-input');
        var btnCloseAlert = document.getElementById('btn-close-alert');

        alerta.style="display:none";

        textContent.onclick = function(e) {
            e.preventDefault();
            Keyboard.close();
        }
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
        btnLimpiar.onclick=function(e){
            e.preventDefault();
            textKeyboardInput.value="";
        }
        btnCloseAlert.onclick=function(e){
            e.preventDefault();
            alerta.style.display="none";
        }
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Events.init();
});