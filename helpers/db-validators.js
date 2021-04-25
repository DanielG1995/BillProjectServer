const role = require("../models/role");
const usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
  const existeRol = await role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no es valido`);
  }
};
const emailExiste = async (correo='') => { 
    if ((await usuario.findOne({ correo }))) {
    throw new Error(`El correo ${correo} ya existe`);    
  }
};

module.exports = {
  esRolValido,
  emailExiste
};
