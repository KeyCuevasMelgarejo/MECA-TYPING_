const placeHolderInput = document.querySelector('.use-content-text');
var writeInput = document.querySelector('.use-keyboard-input');
var alerta = document.getElementById('alert');
var isMobile = false;


const mementos = [];
function saveMemento() {
  mementos.push(writeInput.value);
}


