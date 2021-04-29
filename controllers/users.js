const { response, required } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const usuariosGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true })
      .skip(Number(desde))
      .limit(Number(limite))]);
  res.json({
    total,
    usuarios
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password = "", rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  await usuario.save();
  res.json({
    usuario,
  });
};
const usuariosPut = async (req = required, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;
  if (password) {
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json({
    msg: "put API-controller",
    id,
  });
};
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const uid = req.uid;
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  res.json({
    msg: "delete API",
    usuario,
    uid
  });

};

module.exports = {
  usuariosGet,
  usuariosDelete,
  usuariosPost,
  usuariosPut,
};
