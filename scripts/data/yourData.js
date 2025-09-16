export const yourNotesList = JSON.parse(localStorage.getItem('yourNotesList')) || [];

export function saveToStorage(){
  localStorage.setItem('yourNotesList', JSON.stringify(yourNotesList));
}
