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

            saveMemento(); // from keypress_undo.js
            Text.removeAllText(placeHolderInput);
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

// click on clic-zone and fadedOut use-content-input
document.querySelector(".clic-zone").addEventListener("click",()=>{
    document.querySelector(".clic-zone").classList.add("hidden");
    placeHolderInput.classList.add("fadedOut");

    // when press a key, show keyboard
    setTimeout(function() {
        writeInput.dispatchEvent(new Event("focus")); 
    }, 1000);
});

writeInput.addEventListener("scroll",()=>{
    console.log(writeInput.scrollTop +" "+ writeInput.offsetHeight +" "+ writeInput.scrollHeight);
});