import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import './animation.js';
import './settings.js';
import { darkMode } from './settings.js';
import { quotesAnimation, randomQuotes } from './animation.js'
import { openYourNote } from './Notes/notes.js';
import { yourNotesList, saveToStorage } from './data/yourData.js';


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


function start(){
  buttons.start.addEventListener('click', () => {
    history.pushState({ yourHub: true }, '', "yourHub"); 
    console.log(history.state);
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
      [cards.reminder, cards.goals].forEach(el => el.classList.remove('slideOutRight'));
      [cards.notes, cards.tasks].forEach(el => el.classList.remove('slideOutLeft'));
      [cards.reminder, cards.goals].forEach(el => el.classList.add('slideRight'));
      [cards.notes, cards.tasks].forEach(el => el.classList.add('slideLeft'));

      cards.settings.classList.remove('slideDown');
      cards.settings.classList.add('slideUp');
    }, { once: true });
  });
}

closeBtn.addEventListener('click', closeDashboard)

function closeDashboard(){
    // profile + close button
    [yourProfile, closeBtn].forEach(el => el.classList.remove('click'));
    [yourProfile, closeBtn].forEach(el => el.classList.add('clickk'));
    // grouped sections
    [cards.reminder, cards.goals].forEach(el => el.classList.remove('slideRight'));
    [cards.notes, cards.tasks].forEach(el => el.classList.remove('slideLeft'));
    [cards.reminder, cards.goals].forEach(el => el.classList.add('slideOutRight'));
    [cards.notes, cards.tasks].forEach(el => el.classList.add('slideOutLeft'));

    // settings animation out
    cards.settings.classList.remove('slideUp');
    cards.settings.classList.add('slideDown');
    
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

// history.replaceState({startup: true }, '', 'Startup Menu')

//reminder
cards.reminder.addEventListener('click', () => {
  alert('Still a work in progress.');
})

/**----------For NOTES----------**/

//--open notes feature
cards.notes.addEventListener('click', () => {
  if(!document.querySelector('.overlay')){    
    const noteEl = showMainOverlay();
    openOverlay(noteEl.overlay, noteEl.container);

    noteEl.container.addEventListener('animationend', () => {
      const bodyClick = (e) => {
        if(!noteEl.container.contains(e.target) && e.target !== cards.notes) {
        closeOverlay(noteEl.overlay, noteEl.container, bodyClick);  
        }
      };

      //--close note overlay when clicking outside
      document.body.addEventListener('click', bodyClick);
      window.addEventListener('popstate', e => {
        if(e.state && e.state.yourHub)
          closeOverlay(noteEl.overlay, noteEl.container, bodyClick);  
      }, {once: true})
      
      //--open add note container
      noteEl.addNotes.addEventListener('click', () => {
        if(!document.querySelector('.overlay-box')) {
        history.pushState({createYourNotes: true}, '', 'createYourNotes');
        document.body.removeEventListener('click', bodyClick);
        createAddNoteBox(noteEl.overlay, noteEl.container, bodyClick);  
        console.log(history.state);
        }
      });
    }, { once: true });

  }
});

//--listeners for opening and closing overlay
function openOverlay(overlay, container) {
  history.pushState({yourNotes: true}, '', 'yourNotes');
  console.log(history.state);
  overlay.classList.remove('close');
  overlay.classList.add('open');
  container.classList.remove('close');
  container.classList.add('open');
}

function closeOverlay(overlay, container, bodyClick) {
  container.classList.remove('open');
  container.classList.add('close');
  overlay.classList.remove('open');
  overlay.classList.add('close');
  document.body.removeEventListener('click', bodyClick);
  setTimeout(() => {
    overlay.remove();
  }, 700)
}


//--show all listed notes
function showMainOverlay(){

  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay">
      <div class="notes-container ${!darkMode ? 'light' : ''}">
        <div class="add-notes ${!darkMode ? 'light' : ''}">
          <input id="search-notes" type="text" placeholder="Search for your notes...">
          <i id="add" class="bi bi-plus-lg"></i>
        </div>

        <div class="notes-list">
          ${yourNotesList.length ? getYourNotes() : 'No notes yet.'}
          <!--Generate Notes Here-->
        </div>
      </div>
    </div>
  `);

  yourNotesListener();

  return {
    addNotes:     document.getElementById('add'),
    searchNotes:  document.getElementById('search-notes'),
    yourNotes:    document.querySelectorAll('.your-notes'),
    overlay:      document.querySelector('.overlay'),
    container:    document.querySelector('.notes-container')
  }
}

//--create notes and save to local storage
function saveYourNotes(inputTitle, inputDescription){
  const title = inputTitle.value;
  const description = inputDescription.value.trim().length > 1
  ? inputDescription.value
  : 'No description provided.';
  console.log(description.length);

  const date = dayjs().format('MMM D, YYYY');
  function generateId(length = 5) {
    return `${title}-` + Math.random().toString(36).substr(2, length);
  };
  const id = generateId().replace(/\s+/g, '%');
  yourNotesList.push({
    id,
    title,
    description,
    date,
    bookmark: false,
    textarea: 'Add your notes here...'
  })
  inputTitle.value = '';
  inputDescription.value = '';
  saveToStorage();
  renderYourNotes();
}

//--generate your notes from storage into HTML
function getYourNotes(){
  const noteHTML = yourNotesList.map(note => {
    return `
      <div data-note-id="${note.id}" class="your-notes ${!darkMode ? 'light' : ''}">
        <div class="notes-action-bar">
          <div class="notes-title">
            <h4>${note.title}</h4>
          </div>
          <div class="notes-action ${!darkMode ? 'light' : ''}">
            <i class="edit bi-pencil-square"></i>
            <i data-bookmark-id="${note.id}" class="save bi-bookmark${!note.bookmark ? '' : '-fill'}"></i>
            <i class="trash bi-trash"></i>
          </div>
        </div>
        <div class="description"><textarea class="description-box" readonly>${note.description}</textarea></div>
        <div class="date-created">${note.date}</div>
      </div>
    `
  }).join('');
  return noteHTML;
}


//--render all your notes into the HTML
function renderYourNotes(){
  const notesHTML = getYourNotes();
  document.querySelector('.notes-list').innerHTML = notesHTML || 'No notes yet.';
  yourNotesListener();
}


//--show create notes container
function createAddNoteBox(overlay, container, bodyClick) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay-box">
      <div class="create-notes ${!darkMode ? 'light' : ''}">

        <!---CREATE TITLE--->
        <div class="add-title">
          <label for="title">Title:</label>
          <input type="text" id="title" spellcheck="false" placeholder="Title">
        </div>

        <!---CREATE DESCRIPTION--->
        <div class="add-description">
          <label for="description">Description:</label>
          <textarea id="description" class="description-box ${!darkMode ? 'light' : ''}" spellcheck="false" placeholder="Description"></textarea>
        </div>

        <button class="add-btn" id="addBtn" >Add</button>
      </div>
    </div>
  `);

  //--all elements of create notes container
  const inputDescription = document.getElementById('description');
  const overlayBox = document.querySelector('.overlay-box');
  const inputTitle = document.getElementById('title');
  const createNotesBox = document.querySelector('.create-notes');
  
  //--add animation when opening create notes container
  overlayBox.classList.remove('close');
  overlayBox.classList.add('show');

  //--this is for closing animation of create notes container
  overlayBox.addEventListener('animationend', () => {
    const outsideOverlayBox = (e) => {
      if (!createNotesBox.contains(e.target)) {
        removeCreateNotesBox(outsideOverlayBox);
      }
    };
    document.body.addEventListener('click', outsideOverlayBox);
    window.addEventListener('popstate', e => {
      if(e.state && e.state.yourNotes){
        removeCreateNotesBox(outsideOverlayBox);
      }
    })
  }, {once: true});

  function removeCreateNotesBox(outsideOverlayBox){
    overlayBox.classList.remove('show');
    overlayBox.classList.add('close');
    document.body.removeEventListener('click', outsideOverlayBox);
    document.body.addEventListener('click', bodyClick);
    overlayBox.remove();
    window.addEventListener('popstate', e => {
        if(e.state && e.state.yourHub)
          closeOverlay(overlay, container, bodyClick);  
      }, {once: true})
  }
  
  //--add title for your notes
  inputTitle.addEventListener('input', function(){
    if(this.value.trim().length > 44){
      this.classList.add('error');
      this.value = this.value.slice(0, 45);
    } else {
      this.classList.remove('error');
    }
  })

  //--listener for add button
  document.getElementById('addBtn').addEventListener('click', () => {
    if(inputTitle.value.length > 44){
      inputTitle.focus();
      return;
    }
    if(inputTitle.value !== '')
      saveYourNotes(inputTitle, inputDescription);
  })
}

/*---------listener to open, edit, save or delete your notes---------*/
function yourNotesListener(){

  //--element for notes actions
  const edit = document.querySelectorAll('.bi-pencil-square');
  const bookmarkBtn = document.querySelectorAll('.save');
  const trashBtn = document.querySelectorAll('.bi-trash');

  //--listener to open notes
  document.addEventListener('click', function(e) {
    const open = e.target.closest('.edit, .save, .trash, .notes-title, .notes-action, .description, .date-created');
    if (!open) return;
    const note = open.closest('.your-notes'); 
    const noteId = note.dataset.noteId; 
    if (document.querySelector('.your-note-tab-overlay')) return;
    openYourNote(noteId);
  });

  //--listener to delete notes
  trashBtn.forEach((trash, id) => {
    trash.addEventListener('click', (e) => {
      e.stopPropagation();
      yourNotesList.splice(id, 1);
      saveToStorage();
      renderYourNotes();
    })
  });

  //--listener to save notes
  bookmarkBtn.forEach(bookmark => {
    bookmark.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookmarkId = e.target.dataset.bookmarkId;
      const updateNotes = yourNotesList.find(note => note.id === bookmarkId);
      if(updateNotes) updateNotes.bookmark = !updateNotes.bookmark;
        saveToStorage();
        renderYourNotes();
      })
  });

}
/* ------------ End of Notes Feature Section ------------ */


// goals
cards.goals.addEventListener('click', () => {
  alert('Still a work in progress.');
})

//tasks
cards.tasks.addEventListener('click', () => {
  alert('Still a work in progress.');
})

//settings
buttons.settings.addEventListener('click', () => {
  openSettings();
})

cards.settings.addEventListener('click', () => {
  openSettings();
})

function openSettings(){
  history.pushState({settings: true}, '', 'settings');
  console.log(history.state);
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
    window.addEventListener('popstate', e => {
    if(e.state === null || e.state.yourHub){
      closeSettings(settingsBox);
    }
  })
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

window.addEventListener('popstate', e => {
    console.log(e.state);
  if(e.state === null){
    closeDashboard();
  }
})
history.replaceState(null, '', '');