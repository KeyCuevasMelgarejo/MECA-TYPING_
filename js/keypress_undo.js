const mementos = [];
const input = document.querySelector('.use-keyboard-input');

function saveMemento() {
  mementos.push(input.value);
}

function undo() {
  const lastMemento = mementos.pop();
  Keyboard.properties.value=lastMemento ? lastMemento : input.value;
  input.value = lastMemento ? lastMemento : input.value;
}