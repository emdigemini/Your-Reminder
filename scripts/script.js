import './animation.js';
import { randomQuotes } from './animation.js'
import { openNotesFeature } from './Notes/notes.js';
import { openReminder } from './Reminder/reminder.js';

// header + core sections
const appHeader   = document.querySelector('.app-header');
const appName     = document.querySelector('.app-name');
const yourProfile = document.querySelector('.your-profile');
const closeBtn    = document.querySelector('.bi-x-square');
const startUpMenu = document.querySelector('.start-up-menu');
const dashboard     = document.querySelector('.dashboard');
const dateTime    = document.querySelector('.datetime');
const todayQuotes = document.querySelectorAll('.quote-line');

// buttons
const buttons = {
  start:    document.getElementById('start'),
  settings: document.getElementById('settings'),
  contact:  document.getElementById('contact'),
  about:    document.getElementById('about'),
};

// card sections
const cards = {
  reminder: document.getElementById('reminder'),
  notes:    document.getElementById('notes'),
  goals:    document.getElementById('goals'),
  tasks:    document.getElementById('tasks'),
  settings: document.getElementById('settings2'),
};

closeBtn.addEventListener('click', closeDashboard)

function start(){
  buttons.start.addEventListener('click', () => {
    history.pushState({ yourHub: true }, ''); 
    // initial animations
    appHeader.classList.remove('clickk');
    appHeader.classList.add('click');
    appName.classList.remove('resizee');
    appName.classList.add('resize');
    dateTime.classList.remove('popIn');
    dateTime.classList.add('popOut');

    //quotesOffAnimation
    todayQuotes.forEach(el => el.style.display = 'none');

    // grouped button animations
    [buttons.start, buttons.contact].forEach(el => el.classList.remove('slideInLeft'));
    [buttons.settings, buttons.about].forEach(el => el.classList.remove('slideInRight'));
    [buttons.start, buttons.contact].forEach(el => el.classList.add('slideLeft'));
    [buttons.settings, buttons.about].forEach(el => el.classList.add('slideRight'));

    buttons.start.addEventListener('animationend', () => {
      startUpMenu.style.display = 'none';
      dashboard.style.display = 'flex';

      // profile + close button
      [yourProfile, closeBtn].forEach(el => el.classList.remove('clickk'));
      [yourProfile, closeBtn].forEach(el => el.classList.add('click'));

      // grouped sections
      [cards.notes, cards.tasks].forEach(el => el.classList.remove('slideOutRight'));
      [cards.settings, cards.goals].forEach(el => el.classList.remove('slideOutLeft'));
      [cards.notes, cards.tasks].forEach(el => el.classList.add('slideRight'));
      [cards.settings, cards.goals].forEach(el => el.classList.add('slideLeft'));

      cards.reminder.classList.remove('slideDown');
      cards.reminder.classList.add('slideUp');
    }, { once: true });
  });
}

export function closeDashboard(){
    // profile + close button
    [yourProfile, closeBtn].forEach(el => el.classList.remove('click'));
    [yourProfile, closeBtn].forEach(el => el.classList.add('clickk'));
    // grouped sections
    [cards.notes, cards.tasks].forEach(el => el.classList.remove('slideRight'));
    [cards.settings, cards.goals].forEach(el => el.classList.remove('slideLeft'));
    [cards.notes, cards.tasks].forEach(el => el.classList.add('slideOutRight'));
    [cards.settings, cards.goals].forEach(el => el.classList.add('slideOutLeft'));

    // settings animation out
    cards.reminder.classList.remove('slideUp');
    cards.reminder.classList.add('slideDown');
    
    // time and header name animation out
    appHeader.classList.remove('click');
    appHeader.classList.add('clickk');
    appName.classList.remove('resize');
    appName.classList.add('resizee');
    dateTime.classList.remove('popOut');
    dateTime.classList.add('popIn');

    cards.reminder.addEventListener('animationend', () => {
      dashboard.style.display = 'none';
      startUpMenu.style.display = 'flex';

      // remove grouped button and add in animations
      [buttons.start, buttons.contact].forEach(el => el.classList.remove('slideLeft'));
      [buttons.settings, buttons.about].forEach(el => el.classList.remove('slideRight'));
      [buttons.start, buttons.contact].forEach(el => el.classList.add('slideInLeft'));
      [buttons.settings, buttons.about].forEach(el => el.classList.add('slideInRight'));
      randomQuotes();
    }, { once: true });
}

//  reminder
cards.reminder.addEventListener('click', () => {
  openReminder();
})

// notes
cards.notes.addEventListener('click', () => {
  openNotesFeature();
});

// goals
cards.goals.addEventListener('click', () => {
  alert('Still a work in progress.');
})

//tasks
cards.tasks.addEventListener('click', () => {
  alert('Still a work in progress.');
})

//settings
buttons.settings.addEventListener('click', openSettings);
cards.settings.addEventListener('click', openSettings);

function openSettings(){
  const settings = document.querySelector('.settings');
  const settingsOverlay = document.querySelector('.settings-overlay');

  settings.classList.remove('close');
  settings.classList.add('open');
  settingsOverlay.classList.add('open');

  settings.addEventListener('animationend', () => {
    const settingsBox = (e) => {
      if(!settings.contains(e.target)){
        closeSettings(settingsBox);
      }
    }
    document.body.addEventListener('click', settingsBox);
  }, {once: true});

  function closeSettings(settingsBox){
    settings.classList.add('close');
    settingsOverlay.classList.remove('open');
    document.body.removeEventListener('click', settingsBox);
  }
}



start();

function setHeight() {
  document.querySelector(".container").style.height = window.innerHeight + "px";
}
window.addEventListener("resize", setHeight);
window.addEventListener("orientationchange", setHeight);
setHeight(); // initial

