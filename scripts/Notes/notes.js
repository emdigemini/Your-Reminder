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
      history.replaceState({ yourNoteTab: true }, ""); 
      noteEl.mainOverlay.remove();
      noteEl.noteListBox.classList.remove('open');
      noteEl.noteListBox.classList.add('close');
      noteEl.yourNoteOverlay.classList.add('open');
      noteEl.yourNoteTab.classList.add('open');
      // dragYourNoteTab(noteEl.yourNoteTab);
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

      window.addEventListener('popstate', e => {
        if(e.state !== null && e.state.yourHub){
          closeNoteTab();
        }  
      }, {once: true})

    const dragBtn = document.querySelector('.drag-btn')
    dragBtn.addEventListener('mousedown', dragStart);
    dragBtn.addEventListener('touchstart', dragStart, {once: false});

}
    

