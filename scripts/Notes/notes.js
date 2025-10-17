import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import { darkMode } from "../settings.js";
import { closeDashboard } from '../script.js';
import '../settings.js';

/**----------For NOTES----------**/
const yourNotesList = JSON.parse(localStorage.getItem('yourNotesList')) || [];

/*----------------- Save to Storage -----------------*/
function saveToStorage() {
  localStorage.setItem('yourNotesList', JSON.stringify(yourNotesList));
}

/*----------------- Open Notes Feature -----------------*/
export function openNoteApp() {
  if (!document.querySelector('.overlay')) {
    const noteEl = showMainOverlay();
    openOverlay(noteEl.overlay, noteEl.container);
    searchYourNotes(noteEl.searchNotes);

    noteEl.container.addEventListener('animationend', () => {
      const bodyClick = (e) => {
        if (!noteEl.container.contains(e.target)) {
          closeOverlay(noteEl.overlay, noteEl.container, bodyClick);
        }
      };

      //--close note overlay when clicking outside
      document.body.addEventListener('click', bodyClick);
      window.addEventListener('popstate', e => {
        if (e.state && e.state.yourHub) {
          closeOverlay(noteEl.overlay, noteEl.container, bodyClick);
        }
      }, { once: true });

      //--open add note container
      noteEl.addNotes.addEventListener('click', () => {
        if (!document.querySelector('.overlay-box')) {
          history.pushState({ createYourNotes: true }, '');
          document.body.removeEventListener('click', bodyClick);
          createAddNoteBox(noteEl.overlay, noteEl.container, bodyClick);
        }
      });
    }, { once: true });
  }
}

/*----------------- Overlay Control -----------------*/
function openOverlay(overlay, container) {
  history.pushState({ yourNotes: true }, '');
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
  }, 700);
}

/*----------------- Show Main Overlay -----------------*/
function showMainOverlay() {
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
  };
}

/*----------------- Search Notes -----------------*/
function searchYourNotes(searchNotes) {
  searchNotes.addEventListener('input', () => {
    const search = searchNotes.value;
    const findNotes = yourNotesList.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

    const renderFoundNotes = findNotes.map(note => `
      <div data-note-id="${note.id}" class="your-notes ${!darkMode ? 'light' : ''}">
        <div class="notes-action-bar">
          <div class="notes-title"><h4>${note.title}</h4></div>
          <div class="notes-action ${!darkMode ? 'light' : ''}">
            <i class="edit bi-pencil-square"></i>
            <i data-bookmark-id="${note.id}" class="save bi-bookmark${!note.bookmark ? '' : '-fill'}"></i>
            <i class="trash bi-trash"></i>
          </div>
        </div>
        <div class="description"><textarea class="description-box" readonly>${note.description}</textarea></div>
        <div class="date-created">${note.date}</div>
      </div>
    `).join('');

    document.querySelector('.notes-list').innerHTML = renderFoundNotes || 'No notes found.';
    yourNotesListener();
  });
}

/*----------------- Save Your Notes -----------------*/
function saveYourNotes(inputTitle, inputDescription) {
  const title = inputTitle.value;
  const description = inputDescription.value.trim().length > 1
    ? inputDescription.value
    : 'No description provided.';

  const date = dayjs().format('MMM D, YYYY');

  function generateId() {
    return crypto.randomUUID();
  };

  const id = generateId();
  yourNotesList.unshift({
    id,
    title,
    description,
    date,
    bookmark: false,
    textarea: 'Add your notes here...'
  });

  inputTitle.value = '';
  inputDescription.value = '';
  saveToStorage();
  renderYourNotes();
}

/*----------------- Get Notes -----------------*/
function getYourNotes() {
  return yourNotesList.map(note => `
    <div data-note-id="${note.id}" class="your-notes ${!darkMode ? 'light' : ''}">
      <div class="notes-action-bar">
        <div class="notes-title"><h4>${note.title}</h4></div>
        <div class="notes-action ${!darkMode ? 'light' : ''}">
          <i class="edit bi-pencil-square"></i>
          <i data-bookmark-id="${note.id}" class="save bi-bookmark${!note.bookmark ? '' : '-fill'}"></i>
          <i class="trash bi-trash"></i>
        </div>
      </div>
      <div class="description"><textarea class="description-box" readonly>${note.description}</textarea></div>
      <div class="date-created">${note.date}</div>
    </div>
  `).join('');
}

/*----------------- Render Notes -----------------*/
function renderYourNotes() {
  const notesHTML = getYourNotes();
  document.querySelector('.notes-list').innerHTML = notesHTML || 'No notes yet.';
  yourNotesListener();
}

/*----------------- Create Add Note Box -----------------*/
function createAddNoteBox(overlay, container, bodyClick) {
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
        <button class="add-btn" id="addBtn">Add</button>
      </div>
    </div>
  `);

  //--all elements of create notes container
  const inputDescription = document.getElementById('description');
  const overlayBox = document.querySelector('.overlay-box');
  const inputTitle = document.getElementById('title');
  const createNotesBox = document.querySelector('.create-notes');

  //--add animation when opening
  overlayBox.classList.remove('close');
  overlayBox.classList.add('show');

  //--close animation
  overlayBox.addEventListener('animationend', () => {
    const outsideOverlayBox = (e) => {
      if (!createNotesBox.contains(e.target)) {
        removeCreateNotesBox(outsideOverlayBox);
      }
    };
    document.body.addEventListener('click', outsideOverlayBox);

    window.addEventListener('popstate', e => {
      if (e.state && e.state.yourNotes) {
        removeCreateNotesBox(outsideOverlayBox);
      }
    });
  }, { once: true });

  function removeCreateNotesBox(outsideOverlayBox) {
    overlayBox.classList.remove('show');
    overlayBox.classList.add('close');
    document.body.removeEventListener('click', outsideOverlayBox);
    document.body.addEventListener('click', bodyClick);
    overlayBox.remove();

    window.addEventListener('popstate', e => {
      if (e.state && e.state.yourHub) {
        closeOverlay(overlay, container, bodyClick);
      }
    }, { once: true });
  }

  //--title input listener
  inputTitle.addEventListener('input', function () {
    if (this.value.trim().length > 44) {
      this.classList.add('error');
      this.value = this.value.slice(0, 45);
    } else {
      this.classList.remove('error');
    }
  });

  //--add button listener
  document.getElementById('addBtn').addEventListener('click', () => {
    if (inputTitle.value.length > 44) {
      inputTitle.focus();
      return;
    }
    if (inputTitle.value !== '') saveYourNotes(inputTitle, inputDescription);
  });
}

/*----------------- Notes Listener -----------------*/
function yourNotesListener() {
  const edit = document.querySelectorAll('.bi-pencil-square');
  const bookmarkBtn = document.querySelectorAll('.save');
  const trashBtn = document.querySelectorAll('.bi-trash');

  //--listener to open notes
  document.addEventListener('click', function (e) {
    const open = e.target.closest('.edit, .save, .notes-title, .notes-action, .description, .date-created');
    if (!open) return;
    const note = open.closest('.your-notes');
    const noteId = note.dataset.noteId;
    if (document.querySelector('.your-note-tab-overlay')) return;
    openYourNote(noteId);
  });

  //--listener to delete notes
  trashBtn.forEach(trash => {
    trash.addEventListener('click', (e) => {
      e.stopPropagation();
      const note = trash.closest('.your-notes');
      const noteId = note.dataset.noteId;
      const noteIndex = yourNotesList.findIndex(note => note.id === noteId);
      yourNotesList.splice(noteIndex, 1);
      saveToStorage();
      renderYourNotes();
    });
  });

  //--listener to save notes
  bookmarkBtn.forEach(bookmark => {
    bookmark.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookmarkId = e.target.dataset.bookmarkId;
      const updateNotes = yourNotesList.find(note => note.id === bookmarkId);
      if (updateNotes) updateNotes.bookmark = !updateNotes.bookmark;
      saveToStorage();
      renderYourNotes();
    });
  });
}

/*----------------- Open Note -----------------*/
let noteEl = {

};

function openYourNote(noteId) {
  const yourNote = yourNotesList.find(note => note.id === noteId);
  notepad();

  function notepad() {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="your-note-tab-overlay">
        <div class="your-note-tab" data-note-id="${yourNote.id}">
          <div class="drag-btn"><i class="bi bi-caret-down-fill"></i></div>
          <div class="your-note-title"><h1>${yourNote.title}</h1></div>
          <div class="your-note-page">
            <div class="note-tools">
              <i class="bi bi-alphabet-uppercase toggle-tool"></i>
              <ul>
                <li>
                  <a>H1</a>
                </li>
                <li>
                  <a>H2</a>        
                </li>
                <li>
                  <a>H3</a>
                </li>
                <li>  
                  <a class="bold">B</a>        
                </li>
                <li>
                  <a>U</a>
                </li>
                <li>
                  <a>I</a>
                </li>
              </ul>
            </div>
            <div class="textpad" contenteditable="true" name="">${yourNote.textarea}</div>
          </div>
        </div>
      </div>
    `);
  }
  noteEl = noteTabEl();
  openNoteTab();
  
  function getSelectedText(){
    return window.getSelection().toString();
  }

  noteEl.toggleTool.addEventListener('click', function(){
    if(noteEl.noteTools.classList.contains('active')){
      noteEl.noteTools.classList.remove('active')
      noteEl.noteTools.classList.add('close')
    } else {
      noteEl.noteTools.classList.remove('close');
      noteEl.noteTools.classList.add('active');
    }
  })

  document.querySelector('.bold').addEventListener('click', function(){
    const container = this.closest('.your-note-tab');
    const noteId = container.dataset.noteId;
    const getText = yourNotesList.find(note => note.id === noteId);

    const selectedText = getSelectedText();

    if(getText.textarea.includes(selectedText)){
      getText.textarea = getText.textarea.replace(selectedText, `<b>${selectedText}</b>`);
    }
  });

  
  noteEl.textpad.addEventListener('input', () => {
    const getText = noteEl.textpad.innerHTML;
    yourNote.textarea = getText;
    saveToStorage();
  });

  const closeBtn = document.querySelector('.drag-btn');
  closeBtn.addEventListener('click', () => {
    closeNoteTab();
  });
}

function noteTabEl(){
  const noteEl = {
    mainOverlay:     document.querySelector('.overlay'),
    noteListBox:     document.querySelector('.notes-container'),
    yourNoteOverlay: document.querySelector('.your-note-tab-overlay'),
    yourNoteTab:     document.querySelector('.your-note-tab'),
    textpad:         document.querySelector('.textpad'),
    toggleTool:      document.querySelector('.toggle-tool'),
    noteTools:       document.querySelector('.note-tools')
  }
  return noteEl;
}

const root = document.documentElement;

function openNoteTab() {
  history.pushState({ yourNoteTab: true }, ""); 
  noteEl.mainOverlay.remove();
  noteEl.noteListBox.classList.remove('open');
  noteEl.noteListBox.classList.add('close');
  noteEl.yourNoteOverlay.classList.remove('close');
  noteEl.yourNoteTab.classList.remove('close');
  noteEl.yourNoteOverlay.classList.add('open');
  noteEl.yourNoteTab.classList.add('open');
}

function closeNoteTab() {
  noteEl.yourNoteOverlay.classList.add('close');
  noteEl.yourNoteTab.classList.add('close');
  noteEl.yourNoteTab.addEventListener('animationend', () => {
    noteEl.yourNoteOverlay.remove();
  }, { once: true });
}

/*----------------- Popstate Handling -----------------*/
window.addEventListener('popstate', e => {
  if (e.state !== null && e.state.yourHub) {
    closeNoteTab();
  }
  if (e.state.home) {
    closeDashboard();
  }
});

history.replaceState({ home: true }, '');
