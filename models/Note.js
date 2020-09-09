const mongoose = require("mongoose");

// Creando el esquema y el modelo de las notas a almacenar
const NoteSchema = mongoose.Schema({
  title: String,
  body: String,
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
