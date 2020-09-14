const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Creando el esquema y el modelo de las notas a almacenar
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "is required"],
  },
  password: { type: String, required: true, required: [true, "is required"] },
});

// Encriptando la contraseña del usuario haciando uso de la libreria "bcrypt"
UserSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

// Metodo estatico del modelo para retornor el usuario, si esta en la base de datos
// si no retorna null
UserSchema.statics.authenticate = async (email, password) => {
  const user = await mongoose.model("User").findOne({ email: email });
  if (user) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) reject(err);
        resolve(result === true ? user : null);
      });
    });
  }
  return null;
};

const Note = mongoose.model("User", UserSchema);
module.exports = Note;
