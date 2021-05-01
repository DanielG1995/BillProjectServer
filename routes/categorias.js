const { check } = require("express-validator");
const { validarJWT, validarCampos, validarRolUsuario } = require("../middlewares/");
const { Router } = require("express");
const { 
  actualizarCategoria,
  crearCategoria, 
  obtenerCategorias, 
  obtenerCategoria,
  eliminarCategoria
} = require("../controllers/categorias");
const { validarIdCategoria,existeCategoria } = require("../helpers/db-validators");


const router = Router();
//Obtener todas las categorias
router.get("/", [
  validarJWT,
  validarCampos
], obtenerCategorias);
//Categoria por id
router.get("/:id", [
  validarJWT,
  check('id', 'Id no Valido').isMongoId(),
  check('id').custom(validarIdCategoria),
  validarCampos
], obtenerCategoria);
//Crear categoria - privado - token
router.post("/", [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria)
//Actualizar categoria
router.put("/:id",[
  validarJWT,
  check('id', 'No es un id vàlido').isMongoId(),
  check('id').custom(validarIdCategoria),
  check('nombre', 'Envia un nombre para actualizar').notEmpty(),
  check('nombre').custom(existeCategoria),
  validarCampos
],actualizarCategoria)
//Borrar categoria
router.delete("/:id",[
  validarJWT,
  validarRolUsuario,
  check('id', 'No es un id vàlido').isMongoId(),
  check('id').custom(validarIdCategoria),
  validarCampos
],eliminarCategoria)


module.exports = router;
