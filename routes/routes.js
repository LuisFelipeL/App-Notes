const md = require("marked");
const express = require("express");
const routes = express.Router();

// Modelos
const Note = require("../models/Note");

// Ruta para la lista de notas
routes.get("/", async (req, res) => {
  const notes = await Note.find();
  res.render("index", { notes });
});

// Ruta donde muestra el formulario para agregar nueva nota
routes.get("/notes/new", async (req, res) => {
  const notes = await Note.find();
  res.render("new", { notes });
});

// Ruta para mostrar una nota según el id
routes.get("/notes/:id", async (req, res) => {
  const notes = await Note.find();
  const note = await Note.findById(req.params.id);
  res.render("show", { notes: notes, currentNote: note, md: md });
});

// Ruta que muestra formulario para editar una nota según el id
routes.get("/notes/:id/edit", async (req, res, next) => {
  try {
    const notes = await Note.find();
    const note = await Note.findById(req.params.id);
    res.render("edit", { notes: notes, currentNote: note });
  } catch (err) {
    return next(err);
  }
});

// Rutas para agregar nuevas notas
routes.post("/notes", async (req, res, next) => {
  const data = {
    title: req.body.title,
    body: req.body.body,
  };

  try {
    const note = new Note(data);
    await note.save();
  } catch (err) {
    return next(err);
  }

  res.redirect("/");
});

// Ruta para actualizar una nota según el id
routes.patch("/notes/:id", async (req, res, next) => {
  const id = req.params.id;
  const note = await Note.findById(id);

  note.title = req.body.title;
  note.body = req.body.body;

  try {
    await note.save();
  } catch (err) {
    return next(err);
  }

  res.status(204).send({});
});

// Ruta para eliminar una nota según el id
routes.delete("/notes/:id", async (req, res, next) => {
  try {
    await Note.deleteOne({ _id: req.params.id });
    res.status(204).send({});
  } catch (err) {
    return next(err);
  }
});

module.exports = routes;
