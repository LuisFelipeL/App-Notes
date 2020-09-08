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

// Middleware antes de entrar a alguna ruta
app.use((req, res, next) => {
  console.log("Se ha realizado una nueva petición HTTP");
  next();
});

// Rutas
app.get("/", (req, res) => {
  const name = req.query.name;
  const age = req.query.age;

  req.session.views = (req.session.views || 0) + 1;

  //   res.send(`<h1>Hola ${name}, tienes ${age} años</h1>`);
  const arr = ["Banano", "Fresa", "Papaya", "Naranja"];
  res.render("index", { name, age, arr, views: req.session.views });
});

app.get("/notes/new", (req, res) => {
  res.render("new");
});

app.post("/notes", (req, res) => {
  console.log(req.body);
  res.redirect("/notes/new");
});

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
