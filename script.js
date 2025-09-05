const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');

const body = document.body;
const colors = ['note-yellow','note-blue', 'note-pink' ];

function createNoteElement(text, colorClass) { //Crea un elemento de nota con texto y color

    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass); 
    noteDiv.textContent = text;

    const deleteButton = document.createElement('span'); //agrega un boton de eliminaciómn
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';

    noteDiv.appendChild(deleteButton);
    return noteDiv; //retorna el elemento para ser insertado en el DOM
}

function loadNotes() { //Carga las notas almacenadas en localStorage 
// (aún por implementar, ya que storedNotes está vacío en este fragmento).
// Reconstruye cada nota en pantalla con createNoteElement.

    const storedNotes = [];
    console.log(storedNotes);
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);
            notesContainer.appendChild(newNote);
        });
    }
}


function setInitialTheme() { //Verifica en localStorage si el modo oscuro esta activo
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) { //si es asi, aplica la clase dark-mode
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    }
}

noteInput.addEventListener('input', () => { //Habilita o deshabilita el boton de añadir 
// segun si el campo de texto esta vacio
    addButton.disabled = noteInput.value.trim() === '';
});

toggleThemeButton.addEventListener('click', () => { //Alterna entre modo claro y oscuro, guarda el estado en
    // localstorage y cambia el texto del boton dinamicamente
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

notesContainer.addEventListener('dblclick', (event) => { //permite editar una nota con doble click,
    //Reemplaza el contenido por un <textarea>.
    // Guarda los cambios al perder foco o al presionar Enter.
    // Vuelve a agregar el botón de eliminar.
    // Llama a saveNotes() para persistir.

    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

addButton.addEventListener('click', () => { //Agrega una nueva nota:Toma el texto del input.
// Asigna un color aleatorio de la lista colors.
// Crea y agrega el elemento al contenedor.
// Limpia el input y deshabilita el botón.
// Guarda los cambios en localStorage.
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

notesContainer.addEventListener('click', (event) => { //Elimina una nota si se presiona el botón x.
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

notesContainer.addEventListener('mouseover', (event) => { //Aplica una sombra al pasar el cursor sobre una nota.
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

notesContainer.addEventListener('mouseout', (event) => {  //Restaura la sombra al salir
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

setInitialTheme();
loadNotes();