if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Variables de entorno
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const app = express();
const path = require("path");

//Conexión con base de datos (MongoDB)
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

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

// Middleware para la autenticación del usuario
app.use(async (req, res, next) => {
  const userId = req.session.UserId;
  if (userId) {
    const user = await mongoose.model("User").findById(userId);
    if (user) {
      res.locals.user = user;
    } else {
      delete req.session.userId;
    }
  }
  next();
});

// Configuración de rutas
app.use("/", require("./routes/notes"));
app.use("/user", require("./routes/users"));

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
app.listen(PORT, () => console.log("Servidor escuchando en el puerto " + PORT));
