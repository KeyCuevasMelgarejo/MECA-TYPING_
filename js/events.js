/* about copy and paste
 * ------------------------------------------------- */

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



/* about alert
 * ------------------------------------------------- */

// you try to copy or paste show a message and then you can close it
btnCloseAlert.onclick=function(e){
    e.preventDefault();
    alerta.style.display="none";
}



/* about clean writeinput
 * ------------------------------------------------- */

// clear use-keyboard-input textarea
btnLimpiar.onclick=function(e){
    e.preventDefault();
    Keyboard.properties.value="";
    writeInput.value="";

    saveMemento(); // from keypress_undo.js
    Text.removeAllText(placeHolderInput);
}



/* about textareas
 * ------------------------------------------------- */

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



/* about scrolling
 * ------------------------------------------------- */
// scroll case is called by use-keyboard-input, automatically scroll use-content-text

// on desktop case
writeInput.addEventListener("scroll",()=>{
    placeHolderInput.scrollTop = writeInput.scrollTop;
});

// on mobile case
writeInput.addEventListener('touchmove', function(e) {
    // Invoke appropriate handler depending on the
    // number of touch points.
    switch (e.touches.length) {
      case 1: 
      writeInput.scrollTop = e.touches[0].clientY; 
      placeHolderInput.scrollTop = e.touches[0].clientY; 
        break;
      default: 
        console.log("Not supported"); break;
    }
}, false);



/* about shift
 * ------------------------------------------------- */

// detect which key is on keyup or keydown, you can call it like is_key_down('code of the key')
const is_key_down = (() => {
    const state = {};

    window.addEventListener('keyup', (e) => state[e.key] = false);
    window.addEventListener('keydown', (e) => state[e.key] = true);

    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();