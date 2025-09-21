import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import { darkMode } from "../settings.js";
import { closeDashboard } from '../script.js';
import '../settings.js'; 
/**----------For NOTES----------**/
const yourNotesList = JSON.parse(localStorage.getItem('yourNotesList')) || [];

function saveToStorage(){
  localStorage.setItem('yourNotesList', JSON.stringify(yourNotesList));
}



//--open notes feature
export function openNotesFeature(){
  if(!document.querySelector('.overlay')){    
    const noteEl = showMainOverlay();
    openOverlay(noteEl.overlay, noteEl.container);

    noteEl.container.addEventListener('animationend', () => {
      const bodyClick = (e) => {
        if(!noteEl.container.contains(e.target)) {
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
        history.pushState({createYourNotes: true}, '');
        document.body.removeEventListener('click', bodyClick);
        createAddNoteBox(noteEl.overlay, noteEl.container, bodyClick);  
        }
      });
    }, { once: true });

  }
}

//--listeners for opening and closing overlay
function openOverlay(overlay, container) {
  history.pushState({yourNotes: true}, '');
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

let noteEl = {};

function openYourNote(noteId){
  const yourNote = yourNotesList.find(note => note.id === noteId);
  noteEl = notepad();

  function notepad(){
    document.body.insertAdjacentHTML("beforeend", `
        <div class="your-note-tab-overlay">
          <div class="your-note-tab">
            <div class="drag-btn">
              <i class="bi bi-arrows-expand"></i>
            </div>
            <div class="your-note-title">
              <h1>${yourNote.title}</h1>
            </div>
            <div class="your-note-page">
              <textarea class="textpad" name="">${yourNote.textarea}</textarea>
            </div>
          </div>
        </div>
      `);
      return {
        mainOverlay :     document.querySelector('.overlay'),
        noteListBox :     document.querySelector('.notes-container'),
        yourNoteOverlay : document.querySelector('.your-note-tab-overlay'),
        yourNoteTab :     document.querySelector('.your-note-tab'),
        textpad :         document.querySelector('.textpad'),
      }
  }

  openNoteTab();

  noteEl.textpad.addEventListener('input', () => {
    const getText = noteEl.textpad.value;
    yourNote.textarea = getText;
    saveToStorage();
  })


  //--slide drag for note tab
  const dragBtn = document.querySelector('.drag-btn')
  let offsetY = 0;
  let startY = 0;
  function dragStart(e){
    startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    if(e.type === 'mousedown'){
      document.addEventListener('mousemove', dragging);
      document.addEventListener('mouseup', dragEnd);
    } else {
      document.addEventListener('touchmove', dragging);
      document.addEventListener('touchend', dragEnd);
    }
  }

  function dragging(e){
    const currentY =  e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    offsetY = currentY - startY;
    
    if(offsetY < 2){
      offsetY = 2;
      noteEl.yourNoteTab.style.top = `${offsetY}px`;
    } else if(offsetY > 3){
      noteEl.yourNoteTab.style.top = `${offsetY}px`;
    }
  }

  function dragEnd(){
    noteEl.yourNoteTab.style.top = '';

    if(offsetY > 150){
      closeNoteTab(offsetY);
    }

    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', dragEnd);
  }

  dragBtn.addEventListener('mousedown', dragStart);
  dragBtn.addEventListener('touchstart', dragStart, {once: false});
}

const root = document.documentElement;

function openNoteTab(){
  history.replaceState({ yourNoteTab: true }, ""); 
  noteEl.mainOverlay.remove();
  noteEl.noteListBox.classList.remove('open');
  noteEl.noteListBox.classList.add('close');
  noteEl.yourNoteOverlay.classList.remove('close');
  noteEl.yourNoteTab.classList.remove('close');
  noteEl.yourNoteOverlay.classList.add('open');
  noteEl.yourNoteTab.classList.add('open');
}
function closeNoteTab(offsetY){
  if(offsetY){
    root.style.setProperty('--offset-y', `${offsetY}px`);
    noteEl.yourNoteOverlay.classList.add('close');
    noteEl.yourNoteTab.classList.add('close');
    noteEl.yourNoteTab.addEventListener('animationend', () => {
      noteEl.yourNoteOverlay.remove();
    }, {once: true})
  }else{
    noteEl.yourNoteOverlay.classList.add('close');
    noteEl.yourNoteTab.classList.add('close');
    noteEl.yourNoteTab.addEventListener('animationend', () => {
      noteEl.yourNoteOverlay.remove();
    }, {once: true})
  }
}

window.addEventListener('popstate', e => {
        if(e.state !== null && e.state.yourHub){
          closeNoteTab();
        } 
        if(e.state.home){
          closeDashboard();
        } 
      })
    
      history.replaceState({home: true}, '');

