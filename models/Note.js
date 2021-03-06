const mongoose = require("mongoose");

// Creando el esquema y el modelo de las notas a almacenar
const NoteSchema = mongoose.Schema({
  title: { type: String, required: [true, "El titulo es requerido"] },
  body: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Metodos
NoteSchema.methods.truncateBody = function () {
  if (this.body && this.body.length > 75) {
    return this.body.substring(0, 70) + "...";
  }
  return this.body;
};

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
