const role = require("../models/role");
const usuario = require("../models/usuario");
const Categoria = require("../models/categoria")
const Producto = require("../models/producto")


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
  const categoria = await Categoria.findById({ _id });
  if (!categoria) {
    throw new Error('Id de categoria no valido');
  }

};

const existeCategoria = async (nombre) => {
  const categoria = await Categoria.findOne({ nombre: nombre.toUpperCase() });
  if (categoria) {
    throw new Error('La categoria ' + nombre + ' ya existe');
  }

};

const existeProducto = async (nombre) => {
  if (nombre) {
    const producto = await Producto.findOne({ nombre: nombre.toUpperCase() });
    if (producto) {
      throw new Error('EL Producto ' + nombre + ' ya existe');
    }
  }
};
const existeCategoriaProducto = async (id) => {
  if (id) {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      throw new Error('La categoria no existe');
    }
  }

};

const validarIdProducto = async (_id) => {
  const producto = await Producto.findById({ _id });
  if (!producto) {
    throw new Error('Id de Producto no valido');
  }

};

const validarColeccionesPermitidas = (coleccion = '', colecciones = []) => {

  const incluida = colecciones.includes(coleccion);
  if(!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida`);
  }

  return true;

}



module.exports = {
  validarColeccionesPermitidas,
  esRolValido,
  emailExiste,
  existeUsuarioId,
  validarIdCategoria,
  existeCategoria,
  validarIdProducto,
  existeProducto,
  existeCategoriaProducto
};
