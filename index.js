const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const app = express();
const path = require("path");

//Conexión con base de datos (MongoDB)
mongoose.connect("mongodb://localhost:27017/notes-nodejs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configuración para la carpera de archivos estaticos
app.use("/public", express.static(path.join(__dirname, "public")));

// Configuración del motor de plantillas (Pug)
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

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

// Configuración de rutas
app.use("/", require("./routes/routes"));

// Middleware al no encontrar las rutas establecidas
app.use((req, res, next) => {
  res.status(404).send("Error 404 - No se encontró la ruta solicitada.");
});

// Middleware para el manejo de errores
// app.use((err, req, res, next) => {
//   console.log(err.stack);
//   res.status(500).send(`<h1>Algo salio mal...</h1><p>${err.message}</p>`);
// });

// Configuración de escucha del servidor para peticiones en un puerto
app.listen(3000, () => console.log("Servidor Listo en http://localhost:3000"));
