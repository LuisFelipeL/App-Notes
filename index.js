const express = require("express");
const cookieSession = require("cookie-session");
const app = express();

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
app.get("/", (req, res) => {
  const notes = req.session.notes || [];
  res.render("index", { notes });
});

// Ruta donde muestra el formulario para agregar nueva nota
app.get("/notes/new", (req, res) => {
  res.render("new");
});

// Rutas para agregar nuevas notas
app.post("/notes", (req, res) => {
  req.session.notes = req.session.notes || [];
  const id = (req.session.id || 0) + 1;
  req.session.notes.push({
    id: id,
    title: req.body.title,
    body: req.body.body,
  });
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
