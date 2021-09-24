var placeHolderInput = document.querySelector('.use-content-text'),
  writeInput = document.querySelector('.use-keyboard-input'),
  alerta = document.getElementById('alert'),
  isMobile = false; // for keyboard.js

var btnLimpiar = document.querySelector('.btn'),
  btnCloseAlert = document.getElementById('btn-close-alert');

var btnClientServer = document.querySelector('.btn-client-server'), // for modal socket.js
  modal = document.querySelector('.modal'), // for modal events.js
  span = document.getElementsByClassName("close")[0], // for modal events.js
  modalBody=document.querySelector(".modal-body"), // for socket.js captcha.js
  modalCaptcha=document.querySelector(".modal-captcha"), // for socket.js captcha.js
  modalMessage=document.querySelector(".modal-message"), // for socket.js captcha.js
  timer; // for socket.js captcha.js

var counterTheme = 0,
  counterIdiom = 0; // for text.js

// for resultpanel.js, present on text.js too
var numPalabras=0,
  timeInit,
  error=0,
  success=0,
  book=[];

var mementos = [];
function saveMemento() {
  mementos.push(writeInput.value);
}

/* about card client-server
 * ------------------------------------------------- */
function showFaIcon(faIcon){
  document.querySelectorAll(".btn-client-server i").forEach(element => {
    element.style.display = "none";
  });
  document.querySelector(faIcon).style.display = "block";
}

/* about modal
 * ------------------------------------------------- */

// disable and enable visual and handle events about modal part (head,body,captcha,message)
function disableModalPart(modalPart){
  modalPart.style.opacity ="0.4";
  modalPart.style.pointerEvents = "none";
}
function enableModalPart(modalPart){
  modalPart.style.opacity ="1";
  modalPart.style.pointerEvents = "auto";
}

/* about close window accidentally
 * ------------------------------------------------- */
/*window.onbeforeunload = function() {
  return "¿Estás seguro de abandonar la página?";
};*/