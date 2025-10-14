const toggleMode = document.querySelector('.switch');
const appContainer = document.querySelector('.container');
const settings = document.querySelector('.settings');
const selectTheme = document.querySelector('.select-theme');
const appHeader   = document.querySelector('.app-header');
const root = document.documentElement;

export let darkMode = JSON.parse(localStorage.getItem('darkMode'))|| false;
switchMode()
toggleMode.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', JSON.stringify(darkMode))
  switchMode();
});

function switchMode(){
  // for background
  !darkMode ? root.style.setProperty("--color-background", "#fff8f0") : root.style.setProperty("--color-background", "#000");

  // for text
  !darkMode ? root.style.setProperty("--color-accent", "#462700af") : root.style.setProperty("--color-accent", "#00FF80");
  
  // for empty state
  !darkMode ? root.style.setProperty("--empty-state", "#262626B5") : root.style.setProperty("--empty-state", "#fff8f0");
  
  // for text color
  !darkMode ? root.style.setProperty("--card-goal", "#fff8f0") : root.style.setProperty("--card-goal", "#262626");

  // for card color

  
  toggleMode.classList.toggle('dark', darkMode);
  [settings, selectTheme].forEach(el => el.classList.toggle('light', !darkMode));
  document.body.classList.toggle('light', !darkMode);
}

function theme(){
  
}

