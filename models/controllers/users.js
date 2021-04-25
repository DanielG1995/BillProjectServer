const { response } = require("express");

const usuariosGet = (req, res=response) => {
  res.json({
    msg: "put API",
  });
};

const usuariosPost = (req, res=response) => {
 const body=req.body;
  res.json({
    msg: "post API",
    body
  });
};
const usuariosPut = (req, res=response) => {
  res.json({
    msg: "put API",
  });
};
const usuariosDelete = (req, res=response) => {
  res.json({
    msg: "delete API",
  });
};

module.exports={
  usuariosGet,
  usuariosDelete,
  usuariosPost,
  usuariosPut
}