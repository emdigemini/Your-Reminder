import { yourNotesList, saveToStorage } from "../data/yourData.js";

export function openYourNote(noteId){
  const yourNote = yourNotesList.find(note => note.id === noteId);
  const noteEl = notepad();
  function notepad(){
    document.body.insertAdjacentHTML("beforeend", `
        <div class="your-note-tab-overlay">
          <div class="your-note-tab">
            <div class="drag-btn"></div>
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

    const root = document.documentElement;

    openNoteTab();
    function openNoteTab(){
      noteEl.mainOverlay.remove();
      noteEl.noteListBox.classList.remove('open');
      noteEl.noteListBox.classList.add('close');
      noteEl.yourNoteOverlay.classList.add('open');
      noteEl.yourNoteTab.classList.add('open');
      dragYourNoteTab(noteEl.yourNoteTab);
    }
    function closeNoteTab(offsetY){
      if(offsetY){
        root.style.setProperty('--offset-y', `${offsetY}px`);
        noteEl.yourNoteOverlay.classList.add('close');
        noteEl.yourNoteTab.classList.add('close');
      }else{
        noteEl.yourNoteOverlay.classList.add('close');
        noteEl.yourNoteTab.classList.add('close');
      }
    }
    
    document.addEventListener('click', (e) => {
      if(!noteEl.yourNoteTab.contains(e.target)){
        closeNoteTab();
        noteEl.yourNoteTab.addEventListener('animationend', () => {
          noteEl.yourNoteOverlay.remove();
        }, {once: true})
      }
    })

    noteEl.textpad.addEventListener('input', () => {
      const getText = noteEl.textpad.value;
      yourNote.textarea = getText;
      saveToStorage();
    })

    function dragYourNoteTab(noteTab){
      let offsetY = 0;
      document.querySelector('.drag-btn').addEventListener('mousedown', (e) => {
        let startY = e.clientY;

        function onMouseMove(e){
          offsetY = e.clientY - startY;
          noteTab.style.top = `${offsetY}px`;
        }

        function onMouseUp(){
          noteTab.style.top = "";
          if(offsetY > 300){
            closeNoteTab(offsetY);
            noteEl.yourNoteTab.addEventListener('animationend', () => {
              noteEl.yourNoteOverlay.remove();
            }, {once: true})
          }
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      })
    }
    
}



