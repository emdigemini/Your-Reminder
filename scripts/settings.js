const toggleMode = document.querySelector('.switch');
const appContainer = document.querySelector('.container');

let darkMode = false;
toggleMode.addEventListener('click', () => {
  darkMode = !darkMode;
  toggleMode.classList.toggle('dark', darkMode);
  document.body.classList.toggle('light', !darkMode);
})

