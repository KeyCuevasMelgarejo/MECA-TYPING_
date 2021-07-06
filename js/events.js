const Events = {
    init() {        
        var alerta = document.getElementById('alert');
        var btnLimpiar = document.querySelector('.btn-limpiar');
        var textKeyboardInput = document.querySelector('.use-keyboard-input');
        var btnCloseAlert = document.getElementById('btn-close-alert');

        alerta.style="display:none";

        // you can't copy and paste from text
        textKeyboardInput.onpaste = function(e) {
            e.preventDefault();
            textKeyboardInput.value = textKeyboardInput.value.substring(0, textKeyboardInput.value.length - 1);
            alerta.innerHTML="<strong>¡Ey!</strong> No se permite copiar ni pegar";
            alerta.style="display:block";
            Keyboard.close();
        }
        textKeyboardInput.oncopy = function(e) {
            e.preventDefault();
            textKeyboardInput.value = textKeyboardInput.value.substring(0, textKeyboardInput.value.length - 1);
            alerta.innerHTML="<strong>¡Ey!</strong> No se permite copiar ni pegar";
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
            Keyboard.properties.value="";
            textKeyboardInput.value="";
        }
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Events.init();
});


// close keyboard when press out of .use-keyboard-input
window.addEventListener("click", function (e) {
    var textKeyboardInput = document.querySelector('.use-keyboard-input');
    var keyboard = document.querySelector('.keyboard');
    var btnLimpiar = document.querySelector('.btn-limpiar');
    if (!textKeyboardInput.contains(e.target) 
    && !keyboard.contains(e.target) 
    && !btnLimpiar.contains(e.target)) { 
        Keyboard.close();              
    }
});