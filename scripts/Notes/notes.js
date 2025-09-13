const params = new URLSearchParams(window.location.href);
const noteId = params.get('id');
console.log(noteId);