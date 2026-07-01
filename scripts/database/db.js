let db;

const request = indexedDB.open("yourReminderDB", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;

  if (!db.objectStoreNames.contains('notes')) {
    db.createObjectStore('notes', {
      keyPath: 'id',
      autoIncrement: true 
    });
  }

  if (!db.objectStoreNames.contains("tasks")) {
    db.createObjectStore("tasks", {
      keyPath: "id",
      autoIncrement: true,
    });
  }

  if (!db.objectStoreNames.contains("goals")) {
    db.createObjectStore("goals", {
      keyPath: "id",
      autoIncrement: true,
    });
  }

  if (!db.objectStoreNames.contains("reminders")) {
    db.createObjectStore("reminders", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Database is ready!");
};

request.onerror = (event) => {
  console.log(event.target.error);
};

/** NOTES CRUD */

export function getNotes() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("notes", "readonly");

    const store = transaction.objectStore("notes");

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function getNote(id) {
  if (!id) {
    throw new Error("No selected note.");
    return;
  }
  const transaction = db.transaction("notes", "readonly");

  const store = transaction.objectStore("notes");

  const request = store.get(id);

  request.onsuccess = () => {
    console.log(request.result);
  };

  request.onerror = (event) => {
    console.log(event.target.error);
  };
}

export function createNote(note) {
  if (!note) {
    throw new Error("Note is required.");
    return;
  }

  const transaction = db.transaction("notes", "readwrite");

  const store = transaction.objectStore("notes");

  const request = store.add(note);

  request.onsuccess = () => {
    console.log("Note created!");
  };

  request.onerror = (event) => {
    console.log(event.target.error);
  };
}

function updateNote(note) {
  if (!note) {
    throw new Error("Failed to update note.");
    return;
  }
  const transaction = db.transaction("notes", "readwrite");

  const store = transaction.objectStore("notes");

  const request = store.put(note);

  request.onsuccess = () => {
    console.log("Note updated!");
  };

  request.onerror = (event) => {
    console.log(event.target.error);
  };
}

export function deleteNote(id) {
  if (!id) {
    throw new Error("Failed to delete note.");
    return;
  }
  const transaction = db.transaction("notes", "readwrite");

  const store = transaction.objectStore("notes");

  const request = store.delete(id);

  request.onsuccess = () => {
    console.log("Note deleted!");
  };

  request.onerror = (event) => {
    console.log(event.target.error);
  };
}