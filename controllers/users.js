const { response, required } = require("express");

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
const usuariosPut = (req=required, res=response) => {
  const {id}=req.params;
  res.json({
    msg: "put API-controller",
    id
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