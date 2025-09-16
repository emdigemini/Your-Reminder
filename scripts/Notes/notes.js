import { yourNotesList } from "../data/yourData.js";

export function openYourNote(noteId){
  const noteEl = notepad();
  function notepad(){
    const yourNote = yourNotesList.find(note => note.id === noteId);
    document.body.insertAdjacentHTML("beforeend", `
        <div class="your-note-tab-overlay">
          <div class="your-note-tab">
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
    function openNoteTab(){
      noteEl.mainOverlay.remove();
      noteEl.noteListBox.classList.remove('open');
      noteEl.noteListBox.classList.add('close');
      noteEl.yourNoteOverlay.classList.add('open');
      noteEl.yourNoteTab.classList.add('open');
    }
    function closeNoteTab(){
      noteEl.yourNoteOverlay.classList.add('close');
      noteEl.yourNoteTab.classList.add('close');
    }
    
    document.addEventListener('click', (e) => {
      if(!noteEl.yourNoteTab.contains(e.target)){
        closeNoteTab();
        noteEl.yourNoteTab.addEventListener('animationend', () => {
          noteEl.yourNoteOverlay.remove();
        })
      }
    })

    noteEl.textpad.addEventListener('input', () => {
      const getText = noteEl.textpad.value;
      yourNote.textarea = getText;
      autosave();
    })

    function autosave(){
      localStorage.setItem('yourNotesList', JSON.stringify(yourNotesList));
    }
    
    

}