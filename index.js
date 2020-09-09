const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const app = express();

const Note = require("./models/Note");

//Conexión con base de datos (MongoDB)
mongoose.connect("mongodb://localhost:27017/notes-nodejs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configuración del motor de plantillas (EJS)
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Configuración para la carpera de archivos estaticos
app.use(express.static(__dirname + "/public"));

// Configuración para trabajar con datos enviados desde el cliente
app.use(express.urlencoded({ extended: true }));

// Configuración para trabajar con sesiones en el navegador
// o "express-session" para trabajar con sesiones en el servidor
app.set("trust proxy", 1);
app.use(
  cookieSession({
    secret: "una_cadena_secreta",
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// ------------ Rutas ------------
// Ruta para la lista de notas
app.get("/", async (req, res) => {
  const notes = await Note.find();
  res.render("index", { notes });
});

// Ruta donde muestra el formulario para agregar nueva nota
app.get("/notes/new", (req, res) => {
  res.render("new");
});

// Rutas para agregar nuevas notas
app.post("/notes", async (req, res, next) => {
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
// ------------ FIN Rutas ------------

// Middleware al no encontrar las rutas establecidas
app.use((req, res, next) => {
  res.status(404).send("Error 404 - No se encontró la ruta solicitada.");
});

// Middleware para el manejo de errores
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Algo salio mal...");
});

app.listen(3000, () => console.log("Servidor Listo en http://localhost:3000"));
