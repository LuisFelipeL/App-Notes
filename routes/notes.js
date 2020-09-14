const md = require("marked");
const express = require("express");
const routes = express.Router();

// Modelos
const Note = require("../models/Note");

// Middleware para comprobar si hay un usuario en la sesión
const requireUser = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect("/user/login");
  }
  next();
};

// Ruta para la lista de notas
routes.get("/", requireUser, async (req, res) => {
  const notes = await Note.find({ user: res.locals.user });
  res.render("./notes/index", { notes, title: "Inicio" });
});

// Ruta donde muestra el formulario para agregar nueva nota
routes.get("/notes/new", requireUser, async (req, res) => {
  const notes = await Note.find({ user: res.locals.user });
  res.render("./notes/new", { notes, title: "Crear nueva nota" });
});

// Ruta para mostrar una nota según el id
routes.get("/notes/:id", requireUser, async (req, res) => {
  const notes = await Note.find({ user: res.locals.user });
  const note = await Note.findById(req.params.id);
  res.render("./notes/show", {
    notes: notes,
    currentNote: note,
    md: md,
    title: "Nota",
  });
});

// Ruta que muestra formulario para editar una nota según el id
routes.get("/notes/:id/edit", requireUser, async (req, res, next) => {
  try {
    const notes = await Note.find({ user: res.locals.user });
    const note = await Note.findById(req.params.id);
    res.render("./notes/edit", {
      notes: notes,
      currentNote: note,
      title: "Editar nota",
    });
  } catch (err) {
    return next(err);
  }
});

// Rutas para agregar nuevas notas
routes.post("/notes", requireUser, async (req, res, next) => {
  const data = {
    title: req.body.title,
    body: req.body.body,
    user: res.locals.user,
  };

  try {
    const note = new Note(data);
    await note.save();
    res.redirect("/");
  } catch (err) {
    if (err.name === "ValidationError") {
      const notes = await Note.find({ user: res.locals.user });
      res.render("./notes/new", {
        notes,
        errors: err.errors,
        title: "Crear nueva nota",
      });
    } else {
      return next(err);
    }
  }
});

// Ruta para actualizar una nota según el id
routes.patch("/notes/:id", requireUser, async (req, res, next) => {
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
routes.delete("/notes/:id", requireUser, async (req, res, next) => {
  try {
    await Note.deleteOne({ _id: req.params.id });
    res.status(204).send({});
  } catch (err) {
    return next(err);
  }
});

module.exports = routes;
