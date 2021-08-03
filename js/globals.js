const placeHolderInput = document.querySelector('.use-content-text');
var writeInput = document.querySelector('.use-keyboard-input');
var alerta = document.getElementById('alert');
var isMobile = false; // for keyboard.js

var btnLimpiar = document.querySelector('.btn-limpiar');
var btnCloseAlert = document.getElementById('btn-close-alert');

var counter = 0; // for theme.js

const mementos = [];
function saveMemento() {
  mementos.push(writeInput.value);
}


