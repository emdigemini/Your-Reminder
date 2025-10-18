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

  // for text color 2
  !darkMode ? root.style.setProperty("--text-glass2", "#262626") : root.style.setProperty("--text-glass2", "#fff");

  // for version card
  !darkMode ? root.style.setProperty("--version-card", "#6d341f") : root.style.setProperty("--version-card", "#fff");

  // for card color

  // for glassmorphism
  !darkMode
  ? root.style.setProperty("--glass-bg", `linear-gradient(to bottom, rgba(184,184,184,0.441), rgba(255,248,240,0.800), rgba(255,248,240,0.800), rgba(255,248,240,0.800))`)
  : root.style.setProperty("--glass-bg", `linear-gradient(to bottom, rgba(15,15,15,0.9), rgba(25,25,25,0.9), rgba(30,30,30,0.9))`);

  // for tasks light mode and darkmode

  !darkMode ? root.style.setProperty("--addTask-hover", "#FA7600") : root.style.setProperty("--addTask-hover", "#00FF80");
  
  !darkMode ? root.style.setProperty("--textBtn-hover", "#fff") : root.style.setProperty("--textBtn-hover", "#666");

  !darkMode ? root.style.setProperty("--task-text1", "#462700af") : root.style.setProperty("--task-text1", "#fff");

  !darkMode ? root.style.setProperty("--task-text2", "#3b3b3b") : root.style.setProperty("--task-text2", "#00FF80");

  !darkMode ? root.style.setProperty("--task-border", "none") : root.style.setProperty("--task-border", "1px solid #666");

  
  !darkMode ? root.style.setProperty("--text-glass", "#6e3e13de") : root.style.setProperty("--text-glass", "#00FF80");
  
  toggleMode.classList.toggle('dark', darkMode);
  [settings, selectTheme].forEach(el => el.classList.toggle('light', !darkMode));
  document.body.classList.toggle('light', !darkMode);
}

function theme(){
  
}

