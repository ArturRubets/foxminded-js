const body = document.querySelector('body');
const button = document.querySelector('button');
const currentColor = document.querySelector('.current-color');

function makeRandomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

button.addEventListener('click', () => {
  const color = '#' + makeRandomColor();
  body.style.backgroundColor = color;
  currentColor.textContent = color;
  currentColor.style.color = color;
});
