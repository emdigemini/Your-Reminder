import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { darkMode } from "../settings.js";
import '../settings.js';

/**---------- STORAGE ----------**/
const yourNotesList = JSON.parse(localStorage.getItem('yourNotesList')) || [];

function saveToStorage() {
  localStorage.setItem('yourNotesList', JSON.stringify(yourNotesList));
}

/**---------- OVERLAY UTILITIES ----------**/
function openOverlay(overlay, container) {
  overlay.classList.add('open');
  container.classList.add('open');
}

function closeOverlay(overlay, container, callback) {
  container.classList.replace('open', 'close');
  overlay.classList.replace('open', 'close');
  if (callback) document.body.removeEventListener('click', callback);
  setTimeout(() => overlay.remove(), 700);
}

export function closeNotesOverlay() {
  const overlay = document.querySelector('.overlay');
  const container = document.querySelector('.notes-container');
  closeOverlay(overlay, container);
}

export function closeAnotherOverlay() {
  const overlayBox = document.querySelector('.overlay-box');
  overlayBox?.classList.replace('show', 'close');
}

/**---------- MAIN NOTES APP ----------**/
export function openNoteApp() {
  if (document.querySelector('.overlay')) return;

  const noteEl = showMainOverlay();
  openOverlay(noteEl.overlay, noteEl.container);
  attachSearchListener(noteEl.searchNotes);

  noteEl.container.addEventListener('animationend', () => {
    const bodyClick = e => !noteEl.container.contains(e.target) && closeOverlay(noteEl.overlay, noteEl.container, bodyClick);
    document.body.addEventListener('click', bodyClick);

    window.addEventListener('popstate', e => {
      if (e.state?.yourHub) closeOverlay(noteEl.overlay, noteEl.container, bodyClick);
    }, { once: true });

    noteEl.addNotes.addEventListener('click', () => {
      if (!document.querySelector('.overlay-box')) {
        document.body.removeEventListener('click', bodyClick);
        createAddNoteBox(bodyClick);
      }
    });
  }, { once: true });
}

function showMainOverlay() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay">
      <div class="notes-container ${!darkMode ? 'light' : ''}">
        <div class="add-notes ${!darkMode ? 'light' : ''}">
          <input id="search-notes" type="text" placeholder="Search for your notes...">
          <i id="add" class="bi bi-plus-lg"></i>
        </div>
        <div class="notes-list">
          ${yourNotesList.length ? getNotesHTML() : 'No notes yet.'}
        </div>
      </div>
    </div>
  `);

  attachNotesListener();

  return {
    addNotes: document.getElementById('add'),
    searchNotes: document.getElementById('search-notes'),
    overlay: document.querySelector('.overlay'),
    container: document.querySelector('.notes-container'),
  };
}

/**---------- SEARCH ----------**/
function attachSearchListener(searchInput) {
  searchInput.addEventListener('input', () => {
    const filteredNotes = yourNotesList.filter(note => note.title.toLowerCase().includes(searchInput.value.toLowerCase()));
    document.querySelector('.notes-list').innerHTML = filteredNotes.length ? filteredNotes.map(note => getNoteHTML(note)).join('') : 'No notes found.';
    attachNotesListener();
  });
}

/**---------- NOTES MANAGEMENT ----------**/
function saveYourNotes(titleInput, descInput) {
  const title = titleInput.value.trim();
  const description = descInput.value.trim() || 'No description provided.';
  const date = dayjs().format('MMM D, YYYY');
  const id = crypto.randomUUID();

  yourNotesList.unshift({ id, title, description, date, bookmark: false, textarea: 'Add your notes here...' });

  titleInput.value = '';
  descInput.value = '';
  saveToStorage();
  renderNotes();
}

function getNotesHTML() {
  return yourNotesList.map(note => getNoteHTML(note)).join('');
}

function getNoteHTML(note) {
  return `
    <div data-note-id="${note.id}" class="your-notes ${!darkMode ? 'light' : ''}">
      <div class="notes-action-bar">
        <div class="notes-title"><h4>${note.title}</h4></div>
        <div class="notes-action ${!darkMode ? 'light' : ''}">
          <i class="edit bi-pencil-square"></i>
          <i data-bookmark-id="${note.id}" class="save bi-bookmark${note.bookmark ? '-fill' : ''}"></i>
          <i class="trash bi-trash"></i>
        </div>
      </div>
      <div class="description"><textarea class="description-box" readonly>${note.description}</textarea></div>
      <div class="date-created">${note.date}</div>
    </div>
  `;
}

function renderNotes() {
  document.querySelector('.notes-list').innerHTML = getNotesHTML() || 'No notes yet.';
  attachNotesListener();
}

/**---------- ADD NOTE BOX ----------**/
function createAddNoteBox(bodyClick) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay-box">
      <div class="create-notes ${!darkMode ? 'light' : ''}">
        <div class="add-title"><label for="title">Title:</label><input type="text" id="title" placeholder="Title"></div>
        <div class="add-description"><label for="description">Description:</label><textarea id="description" class="${!darkMode ? 'light' : ''}" placeholder="Description"></textarea></div>
        <button class="add-btn" id="addBtn">Add</button>
      </div>
    </div>
  `);

  const overlayBox = document.querySelector('.overlay-box');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const addBtn = document.getElementById('addBtn');
  const createNotesBox = document.querySelector('.create-notes');

  overlayBox.classList.add('show');
  pushHistoryState();

  overlayBox.addEventListener('animationend', () => {
    const outsideClick = e => !createNotesBox.contains(e.target) && removeAddNoteBox(outsideClick);
    document.body.addEventListener('click', outsideClick);
    window.addEventListener('popstate', e => e.state?.yourNotes && removeAddNoteBox(outsideClick));
  }, { once: true });

  titleInput.addEventListener('input', () => {
    if (titleInput.value.trim().length > 44) {
      titleInput.value = titleInput.value.slice(0, 45);
      titleInput.classList.add('error');
    } else {
      titleInput.classList.remove('error');
    }
  });

  addBtn.addEventListener('click', () => {
    if (titleInput.value.trim() && titleInput.value.length <= 44) saveYourNotes(titleInput, descInput);
  });

  function removeAddNoteBox(listener) {
    overlayBox.classList.replace('show', 'close');
    document.body.removeEventListener('click', listener);
    document.body.addEventListener('click', bodyClick);
    overlayBox.remove();
  }
}

function pushHistoryState() {
  if (history.state?.page !== 'goals') history.pushState({ page: 'createNotes' }, '');
}

/**---------- NOTES EVENT LISTENERS ----------**/
function attachNotesListener() {
  document.querySelectorAll('.trash').forEach(trash => trash.addEventListener('click', deleteNote));
  document.querySelectorAll('.save').forEach(save => save.addEventListener('click', toggleBookmark));

  document.addEventListener('click', e => {
    const target = e.target.closest('.edit, .save, .notes-title, .notes-action, .description, .date-created');
    if (!target || document.querySelector('.your-note-tab-overlay')) return;
    openYourNote(target.closest('.your-notes').dataset.noteId);
  });
}

function deleteNote(e) {
  e.stopPropagation();
  const noteId = e.target.closest('.your-notes').dataset.noteId;
  const index = yourNotesList.findIndex(note => note.id === noteId);
  if (index > -1) {
    yourNotesList.splice(index, 1);
    saveToStorage();
    renderNotes();
  }
}

function toggleBookmark(e) {
  e.stopPropagation();
  const noteId = e.target.dataset.bookmarkId;
  const note = yourNotesList.find(note => note.id === noteId);
  if (note) {
    note.bookmark = !note.bookmark;
    saveToStorage();
    renderNotes();
  }
}

/**---------- OPEN AND EDIT INDIVIDUAL NOTE ----------**/
let noteEl = {};

function openYourNote(noteId) {
  const note = yourNotesList.find(n => n.id === noteId);
  if (!note) return;

  insertNoteTabHTML(note);
  noteEl = getNoteTabElements();
  openNoteTab();

  noteEl.toggleTool.addEventListener('click', toggleTools);
  document.querySelector('.bold').addEventListener('click', () => applyBold(note));

  noteEl.textpad.addEventListener('input', () => {
    note.textarea = noteEl.textpad.innerHTML;
    saveToStorage();
  });

  document.querySelector('.drag-btn').addEventListener('click', closeNoteTab);
}

function insertNoteTabHTML(note) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="your-note-tab-overlay">
      <div class="your-note-tab" data-note-id="${note.id}">
        <div class="drag-btn"><i class="bi bi-caret-down-fill"></i></div>
        <div class="your-note-title"><h1>${note.title}</h1></div>
        <div class="your-note-page">
          <div class="note-tools">
            <i class="bi bi-alphabet-uppercase toggle-tool"></i>
            <ul>
              <li><a>H1</a></li>
              <li><a>H2</a></li>
              <li><a>H3</a></li>
              <li><a class="bold">B</a></li>
              <li><a>U</a></li>
              <li><a>I</a></li>
            </ul>
          </div>
          <div class="textpad" contenteditable="true">${note.textarea}</div>
        </div>
      </div>
    </div>
  `);
}

function getNoteTabElements() {
  return {
    mainOverlay: document.querySelector('.overlay'),
    noteListBox: document.querySelector('.notes-container'),
    yourNoteOverlay: document.querySelector('.your-note-tab-overlay'),
    yourNoteTab: document.querySelector('.your-note-tab'),
    textpad: document.querySelector('.textpad'),
    toggleTool: document.querySelector('.toggle-tool'),
    noteTools: document.querySelector('.note-tools'),
  };
}

function toggleTools() {
  noteEl.noteTools.classList.toggle('active');
  noteEl.noteTools.classList.toggle('close');
}

function applyBold(note) {
  const selectedText = window.getSelection().toString();
  if (selectedText && note.textarea.includes(selectedText)) {
    note.textarea = note.textarea.replace(selectedText, `<b>${selectedText}</b>`);
  }
}

function openNoteTab() {
  if (!noteEl.yourNoteOverlay) history.pushState({ page: 'notes' }, '');
  noteEl.mainOverlay?.remove();
  noteEl.noteListBox?.classList.replace('open', 'close');
  noteEl.yourNoteOverlay?.classList.add('open');
  noteEl.yourNoteTab?.classList.add('open');
}

function closeNoteTab() {
  history.back();
  noteEl.yourNoteOverlay?.classList.add('close');
  noteEl.yourNoteTab?.classList.add('close');
  noteEl.yourNoteTab?.addEventListener('animationend', () => noteEl.yourNoteOverlay?.remove(), { once: true });
}

export function closeNotes() {
  const overlay = document.querySelector('.your-note-tab-overlay');
  const tab = document.querySelector('.your-note-tab');
  overlay?.classList.add('close');
  tab?.classList.add('close');
  tab?.addEventListener('animationend', () => overlay?.remove(), { once: true });
}
