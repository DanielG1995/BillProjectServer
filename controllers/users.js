const { response, required } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const usuariosGet = (req, res = response) => {
  res.json({
    msg: "put API",
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password="", rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  await usuario.save();
  res.json({
    usuario,
  });
};
const usuariosPut = (req = required, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "put API-controller",
    id,
  });
};
const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete API",
  });
};

module.exports = {
  usuariosGet,
  usuariosDelete,
  usuariosPost,
  usuariosPut,
};
