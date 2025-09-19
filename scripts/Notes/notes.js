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
      console.log(history.state);
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

    function dragYourNoteTab(noteTab){
      let offsetY = 0;
      document.querySelector('.drag-btn').addEventListener('touchstart', (e) => {
        let startY = e.touches[0].clientY;

        function touchMove(e){
          offsetY = e.touches[0].clientY - startY;
          if(offsetY < 0){
            offsetY = 0;
            noteTab.style.top = `${offsetY}px`;
          }else {
            noteTab.style.top = `${offsetY}px`;
          }
          
        }

        function touchEnd(){
          noteTab.style.top = "";

          if(offsetY > 100){
            closeNoteTab(offsetY);
          }

        }

        document.addEventListener('touchmove', touchMove);
        document.addEventListener('touchend', touchEnd);
      });

      window.addEventListener('popstate', e => {
        if(e.state !== null && e.state.yourHub){
          closeNoteTab();
        }  
      }, {once: true})

      
          

      /*------------will use this later for desktop use and mobile------------*/

      // const dragBtn = document.querySelector('.drag-btn');

      //   let offsetY = 0;
      //   let startY = 0;

      //   function dragStart(e){
      //     startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

      //     if(e.type === 'mousedown'){
      //       document.addEventListener("mousemove", dragging);
      //       document.addEventListener('mouseup', dragEnd);
      //     }else {
      //       document.addEventListener("touchmove", dragging);
      //       document.addEventListener('touchend', dragEnd);
      //     }
      //   }

      //   function dragging(e){
      //     const currentY =  e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
      //     offsetY = currentY - startY;
      //     noteTab.style.top = `${offsetY}px`;
      //   }

      //   function dragEnd(){
      //     noteTab.style.top = "";

      //     if(offsetY > 300){
      //       closeNoteTab(offsetY);
      //       noteEl.yourNoteTab.addEventListener('animationend', () => {
      //         noteEl.yourNoteOverlay.remove();
      //       }, {once: true})
      //     }

      //     document.removeEventListener("mousemove", dragging);
      //     document.removeEventListener('mouseup', dragEnd);

      //     document.removeEventListener("touchmove", dragging);
      //     document.removeEventListener("touchend", dragEnd);
      //   }

      //   dragBtn.addEventListener("mousedown", dragStart);
      //   dragBtn.addEventListener("touchstart", dragStart, {passive: false});
        
    }
    
}

