const Events = {
    init() {        
        var btnLimpiar = document.querySelector('.btn-limpiar');
        var btnCloseAlert = document.getElementById('btn-close-alert');

        alerta.style="display:none";

        // you can't copy and paste from text
        writeInput.onpaste = function(e) {
            e.preventDefault();
            writeInput.value = writeInput.value.substring(0, writeInput.value.length - 1);
            alerta.querySelector("div").innerHTML='<strong>¡Ey!</strong> No se permite copiar ni pegar';
            alerta.style="display:block";
            Keyboard.close();
        }
        writeInput.oncopy = function(e) {
            e.preventDefault();
            writeInput.value = writeInput.value.substring(0, writeInput.value.length - 1);
            alerta.querySelector("div").innerHTML='<strong>¡Ey!</strong> No se permite copiar ni pegar';
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
            writeInput.value="";
        }
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Events.init();
});


// close keyboard when press out of .use-keyboard-input
window.addEventListener("click", function (e) {
    var keyboard = document.querySelector('.keyboard');
    var btnLimpiar = document.querySelector('.btn-limpiar');
    if (!writeInput.contains(e.target) 
    && !keyboard.contains(e.target) 
    && !btnLimpiar.contains(e.target)) { 
        Keyboard.close();              
    }
});