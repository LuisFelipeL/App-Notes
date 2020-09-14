const express = require("express");
const routes = express.Router();

// Modelos
const User = require("../models/User");

// Ruta para renderizar la vista de registro de un usuario
routes.get("/register", (req, res) => {
  res.render("./users/register", { title: "Registro" });
});

// Ruta para renderizar la vista de login de un usuario
routes.get("/login", (req, res) => {
  res.render("./users/login", { title: "Login" });
});

// Ruta para desloguear al usuario
routes.get("/logout", async (req, res) => {
  req.session = null;
  res.clearCookie("express:sess");
  res.clearCookie("express:sess.sig");
  res.redirect("/user/login");
});

// Ruta para registrar a un usuario
routes.post("/register", async (req, res, next) => {
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    res.redirect("/user/login");
  } catch (err) {
    return next(err);
  }
});

// Ruta para loguear a un usuario
routes.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body.email, req.body.password);
    if (user) {
      req.session.UserId = user._id;
      res.redirect("/");
    } else {
      res.redirect("/user/login", {
        error: "El correro o email estan mal, vuelve a intentarlo.",
      });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = routes;
