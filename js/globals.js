var placeHolderInput = document.querySelector('.use-content-text');
var writeInput = document.querySelector('.use-keyboard-input');
var alerta = document.getElementById('alert');
var isMobile = false; // for keyboard.js

var btnLimpiar = document.querySelector('.btn');
var btnCloseAlert = document.getElementById('btn-close-alert');

var counterTheme = 0; // for theme.js
var counterIdiom = 0; // for text.js

// for resultpanel.js, present on text.js too
var numPalabras=0;
var timeInit;
var error=0; 
var success=0;
var book=[];

var mementos = [];
function saveMemento() {
  mementos.push(writeInput.value);
}


