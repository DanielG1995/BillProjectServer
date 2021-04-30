const role = require("../models/role");
const usuario = require("../models/usuario");
const Categoria = require("../models/categoria")


const esRolValido = async (rol = "") => {
  const existeRol = await role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no es valido`);
  }
};
const emailExiste = async (correo = "") => {
  if (await usuario.findOne({ correo })) {
    throw new Error(`El correo ${correo} ya existe`);
  }
};
const existeUsuarioId = async (_id) => {
  if (!(await usuario.findById({ _id }))) {
    throw new Error(`El Id ${id} no existe`);
  }
};
const validarIdCategoria = async (_id) => {
  const categoria = await Categoria.findById({_id});
  if (!categoria) {
    throw new Error('Id de categoria no valido');
  }

};

const existeCategoria = async (nombre) => {
  const categoria = await Categoria.findOne({ nombre });
  if (categoria) {
    throw new Error('La categoria '+nombre+' ya existe');
  }

};



module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioId,
  validarIdCategoria,
  existeCategoria
};
