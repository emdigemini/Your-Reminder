const toggleMode = document.querySelector('.switch');
const appContainer = document.querySelector('.container');
const settings = document.querySelector('.settings');
const selectTheme = document.querySelector('.select-theme');
const appHeader   = document.querySelector('.app-header');
const root = document.documentElement;
const backToMenu = document.querySelector('.back-to-menu');

backToMenu.addEventListener('click', () => {
  settings.classList.add('close')
})

<<<<<<< HEAD
export let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
toggleMode.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', JSON.stringify(darkMode))
  switchMode();
});

switchMode();
function switchMode(){
  console.log(darkMode);
=======
let darkMode = localStorage.getItem('darkMode') || false;
switchMode()
toggleMode.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode)
  switchMode();
});

function switchMode(){
>>>>>>> e67aef8eeceb288e737af47705cde676d942a408
  !darkMode ? root.style.setProperty("--color-accent", "#262626") : root.style.setProperty("--color-accent", "#00FF80");
  
  toggleMode.classList.toggle('dark', darkMode);
  [settings, selectTheme].forEach(el => el.classList.toggle('light', !darkMode));
  document.body.classList.toggle('light', !darkMode);
<<<<<<< HEAD
}
=======
}

>>>>>>> e67aef8eeceb288e737af47705cde676d942a408
