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

export let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
toggleMode.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', JSON.stringify(darkMode))
  switchMode();
});

switchMode();
function switchMode(){
  console.log(darkMode);
  !darkMode ? root.style.setProperty("--color-accent", "#262626") : root.style.setProperty("--color-accent", "#00FF80");
  
  toggleMode.classList.toggle('dark', darkMode);
  [settings, selectTheme].forEach(el => el.classList.toggle('light', !darkMode));
  document.body.classList.toggle('light', !darkMode);
}