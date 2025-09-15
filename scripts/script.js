import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import './animation.js';
import './settings.js';
import { darkMode } from './settings.js';
import { quotesAnimation, randomQuotes } from './animation.js'

// header + core sections
const appHeader   = document.querySelector('.app-header');
const appName     = document.querySelector('.app-name');
const yourProfile = document.querySelector('.your-profile');
const closeBtn    = document.querySelector('.bi-x-square');
const startUpMenu = document.querySelector('.start-up-menu');
const dashboard     = document.querySelector('.dashboard');
const dateTime    = document.querySelector('.datetime');
const todayQuotes = document.querySelectorAll('.quote-line');
const settings = document.querySelector('.settings');
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

function close(){
  closeBtn.addEventListener('click', () => {
    // profile + close button
    [yourProfile, closeBtn].forEach(el => el.classList.remove('click'));
    [yourProfile, closeBtn].forEach(el => el.classList.add('clickk'));
    // grouped sections
    [cards.reminder, cards.goals].forEach(el => el.classList.remove('slideRight'));
    [cards.notes, cards.tasks].forEach(el => el.classList.remove('slideLeft'));
    [cards.reminder, cards.goals].forEach(el => el.classList.add('slideOutRight'));
    [cards.notes, cards.tasks].forEach(el => el.classList.add('slideOutLeft'));

    cards.settings.classList.remove('slideUp');
    cards.settings.classList.add('slideDown');
    
    appHeader.classList.remove('click');
    appHeader.classList.add('clickk');
    appName.classList.remove('resize');
    appName.classList.add('resizee');
    dateTime.classList.remove('popOut');
    dateTime.classList.add('popIn');
    cards.reminder.addEventListener('animationend', () => {
      dashboard.style.display = 'none';
      startUpMenu.style.display = 'flex';

      // grouped button animations
      [buttons.start, buttons.contact].forEach(el => el.classList.remove('slideLeft'));
      [buttons.settings, buttons.about].forEach(el => el.classList.remove('slideRight'));
      [buttons.start, buttons.contact].forEach(el => el.classList.add('slideInLeft'));
      [buttons.settings, buttons.about].forEach(el => el.classList.add('slideInRight'));
      randomQuotes();
    }, { once: true });
  })
}

//reminder
cards.reminder.addEventListener('click', () => {
  window.location.href = 'apps/reminder.html';
})

  /**For NOTES */
  const yourNotesList = JSON.parse(localStorage.getItem('yourNotesList')) || [];

  // main overlay
  cards.notes.addEventListener('click', () => {
    if(!document.querySelector('.overlay')){
      const notesElement = showMainOverlay();
      openOverlay(notesElement.overlay, notesElement.container);
      notesElement.container.addEventListener('animationend', () => {
        const bodyClick = (e) => {
          if (!notesElement.container.contains(e.target) && e.target !== cards.notes) {
            closeOverlay(notesElement.overlay, notesElement.container, bodyClick);
          }
        };
        document.body.addEventListener('click', bodyClick);
        
        notesElement.addNotes.addEventListener('click', () => {
          if(!document.querySelector('.overlay-box')) {
            document.body.removeEventListener('click', bodyClick);
            createAddNoteBox(bodyClick);
          }
        });
      }, { once: true });
    }
  });

  // listeners for each overlay
  function openOverlay(overlay, container) {
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
    setTimeout(() => {
      overlay.remove();
    }, 500)
    document.body.removeEventListener('click', bodyClick);
  }

  function createAddNoteBox(bodyClick) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay-box">
        <div class="create-notes ${!darkMode ? 'light' : ''}">
          <div class="add-title">
            <label for="title">Title:</label>
            <input type="text" id="title" spellcheck="false" placeholder="Title">
          </div>
          <div class="add-description">
            <label for="description">Description:</label>
            <textarea id="description" class="description-box ${!darkMode ? 'light' : ''}" spellcheck="false" placeholder="Description"></textarea>
          </div>
          <button class="add-btn" id="addBtn" >Add</button>
        </div>
      </div>
    `);

   // document.body.removeEventListener('click', bodyClick);

    const inputTitle = document.getElementById('title');
    const inputDescription = document.getElementById('description');

    document.getElementById('addBtn').addEventListener('click', () => {
      if(inputTitle.value !== '') saveYourNotes(inputTitle, inputDescription);
    })

    const overlayBox = document.querySelector('.overlay-box');
    const createNotesBox = document.querySelector('.create-notes');

    overlayBox.classList.remove('close');
    overlayBox.classList.add('show');

    overlayBox.addEventListener('animationend', () => {
      const outsideOverlay = (e) => {
        if (!createNotesBox.contains(e.target)) {
          overlayBox.classList.remove('show');
          overlayBox.classList.add('close');
          document.body.removeEventListener('click', outsideOverlay);
          document.body.addEventListener('click', bodyClick);
          overlayBox.remove();
        }
      };
      document.body.addEventListener('click', outsideOverlay);
    }, {once: true});

  }

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

    function yourNotesListener(){

      const edit = document.querySelectorAll('.bi-pencil-square');
      const bookmarkBtn = document.querySelectorAll('.save');
      const trashBtn = document.querySelectorAll('.bi-trash');

      document.addEventListener('click', function(e) {
        const action = e.target.closest('.edit, .save, .trash, .notes-title, .notes-action, .description, .date-created');
        if (!action) return;
        const note = action.closest('.your-notes'); 
        const noteId = note.dataset.noteId; 
        window.location.href = `apps/notes.html?id=${encodeURIComponent(noteId)}`
      });

      trashBtn.forEach((trash, id) => {
        trash.addEventListener('click', (e) => {
          e.stopPropagation();
          yourNotesList.splice(id, 1);
          saveToStorage();
          renderYourNotes();
        })
      });


      bookmarkBtn.forEach(bookmark => {
        bookmark.addEventListener('click', (e) => {
          e.stopPropagation();
          const bookmarkId = e.target.dataset.bookmarkId;
          const updateNotes = yourNotesList.find(note => note.id === bookmarkId);
          if(updateNotes) updateNotes.bookmark = !updateNotes.bookmark;
            saveToStorage();
            console.log(yourNotesList);
            renderYourNotes();
          })
      })

    }

  // create notes and save to storage
  function saveYourNotes(inputTitle, inputDescription){
    const title = inputTitle.value;
    const description = inputDescription.value;
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
    })
    inputTitle.value = '';
    inputDescription.value = '';
    saveToStorage();
    renderYourNotes();
  }

  function saveToStorage(){
    localStorage.setItem('yourNotesList', JSON.stringify(yourNotesList));
  }

  // generate your notes from storage into HTML
  function getYourNotes(){
    const toHTML = yourNotesList.map(note => {
      return `
        <div data-note-id="${note.id}" class="your-notes ${!darkMode ? 'light' : ''}">
          <div class="notes-title">
            <h4>${note.title}</h4>
              <div class="notes-action ${!darkMode ? 'light' : ''}">
                <i class="edit bi-pencil-square"></i>
                <i data-bookmark-id="${note.id}" class="save bi-bookmark${!note.bookmark ? '' : '-fill'}"></i>
                <i class="trash bi-trash"></i>
              </div>
          </div>
          <textarea class="description" disabled>${note.description}</textarea>
          <div class="date-created">${note.date}</div>
        </div>
      `
    }).join('');
    return toHTML;
  }
  // render all your notes into the HTML
  function renderYourNotes(){
    document.querySelector('.notes-list').innerHTML = `${!getYourNotes() ? 'No notes yet.' : getYourNotes()}`;
    yourNotesListener();
  }

// goals
cards.goals.addEventListener('click', () => {
  window.location.href = 'apps/goals.html';
})

//tasks
cards.tasks.addEventListener('click', () => {
  window.location.href = 'apps/tasks.html';
})

//settings
buttons.settings.addEventListener('click', () => {
  openSettings();
})

cards.settings.addEventListener('click', () => {
  openSettings();
})

function openSettings(){
  settings.classList.remove('close');
  settings.classList.add('open');
  settings.addEventListener('animationend', () => {
    const closeSettings = (e) => {
      if(!settings.contains(e.target)){
        settings.classList.add('close');
        document.body.removeEventListener('click', closeSettings);
      }
    }
    document.body.addEventListener('click', closeSettings)
  }, {once: true});
}



start();
close();
