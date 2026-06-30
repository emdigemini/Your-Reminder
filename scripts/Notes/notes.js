import { setIsTabOpen } from "../script.js";
import { getNotes, createNote } from "../database/db.js";

// const getNotes = () => {
//   return JSON.parse(localStorage.getItem('yourNotes')) || [];
// }

function Notes() {
  setIsTabOpen(true);
  document.body.insertAdjacentHTML('beforebegin',`
    <div class="notes-container">
      <!-- 1. Header Name -->
      <header class="notes-header">
        <h2>Your Notes</h2>
        <p>View and organize all your notes in one place. ⭐</p>
      </header>
      
      <div class="close-notes">
        <i class="toggle-btn bi bi-caret-down"></i>
      </div>

      <!-- 2. Create Notes Bar -->
      <section class="create-notes-bar">
        <input type="text" placeholder="Note title..." class="note-input-title" />
        <textarea placeholder="Take a note..." class="note-input-body" rows="2"></textarea>
        <button class="btn-add">Add Note</button>
      </section>

      <!-- 3. Action Notes Bar -->
      <div class="action-notes-bar">
        <div class="search-wrapper">
          <input type="text" placeholder="Search notes..." class="note-search" />
        </div>
        <div class="action-filters">
          <select class="sort-select">
            <option value="recent">Recent</option>
            <option value="alphabetical">A-Z</option>
          </select>
          <button class="btn-save">Save</button>
        </div>
      </div>

      <!-- 4. Notes List -->
      <ul class="notes-list">
        
        
        <li class="note-item">
          <div class="note-content">
            <h3>🛒 Groceries</h3>
            <p>Almond milk, coffee beans, avocados, and sourdough bread.</p>
            <span class="note-date">Updated 3 hours ago</span>
          </div>
          <div class="note-actions">
            <button class="btn-icon">✏️</button>
            <button class="btn-icon delete">🗑️</button>
          </div>
        </li>
      </ul>
    </div>
  `);
  openNotesTab();
  functionalityNotes();
}

function openNotesTab() {
  const notesContainer = document.querySelector('.notes-container'); 
  notesContainer.classList.remove('close');
  notesContainer.classList.add('open');
}

function functionalityNotes() {
  const closeNotesBtn = document.querySelector('.close-notes');
  const notesList = document.querySelector('.notes-list');
  const addNoteBtn = document.querySelector('.btn-add');

  // close note tab
  closeNotesBtn.addEventListener('click', () => {
    const notesContainer = document.querySelector('.notes-container');
    notesContainer.classList.add('close');

    notesContainer.addEventListener('animationend', () => { 
      notesContainer.classList.remove('open');
      notesContainer.remove();
      setIsTabOpen(false);
    });
  });

  // create new notes
  const newNotes = () => {
    const noteTitle = document.querySelector('.note-input-title');
    const noteText = document.querySelector('.note-input-body');

    if (!noteTitle.value) return;
    const note = {
      title: noteTitle.value,
      content: noteText.value,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    createNote(note);
    noteTitle.value = '';
    noteText.value = '';
    renderNotes();
  }

  // CRUD LISTENER
  addNoteBtn.addEventListener('click', newNotes);


  async function renderNotes() {
    const notes = await getNotes();
    const sortNotes = notes.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    const lists = sortNotes?.map((n) => {
      const isJustCreated = Date.now(n.createdAt) === Date.now(n.updatedAt);
      const now = Date.now();

      const createdText = getTimeText(n.createdAt, "Created");
      const updatedText = getTimeText(n.updatedAt, "Updated");

      return (
        `
        <li class="note-item">
          <div class="note-content">
            <h3>${n.title}</h3>
            <p>${n.content}</p>
            <span class="note-date">
              ${isJustCreated ? createdText : updatedText}
            </span>
          </div>
          <div class="note-actions">
            <button class="btn-icon">✏️</button>
            <button class="btn-icon delete">🗑️</button>
          </div>
        </li>
        `
      )
    }).join("");

    const emptyList = `
      <div style="
        background-color: #ffffff;
        border-radius: 12px;
        border: 1px solid #e2dcd0;
        padding: 40px 24px;
        text-align: center;
        margin-top: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      ">
        <div style="font-size: 3rem; marginBottom: 12px">📝</div>
        <h3 style={{ 
          margin: 0 0 6px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d2a26;
          letter-spacing: -0.3px;
        }}>
          Your notebook is empty
        </h3>
        <p style={{ 
          margin: 0, 
          font-size: 0.9rem; 
          color: #8c8273;
          line-height: 1.4;
        }}>
          There are no notes here yet. Type something above to get started! ✨
        </p>
      </div>
      `;  

    notesList.innerHTML = lists?.length > 0 
      ? lists : emptyList ;
  }

  renderNotes();
}

function getTimeText(timestamp, action) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return `Just ${action.toLowerCase()}`;
  }

  if (diffMinutes < 60) {
    return `${action} ${diffMinutes} ${diffMinutes === 1 ? "min" : "mins"} ago`;
  }

  if (diffHours < 24) {
    return `${action} ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  return `${action} ${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
}



export default Notes;