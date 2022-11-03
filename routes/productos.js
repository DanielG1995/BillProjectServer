const { check } = require("express-validator");
const { validarJWT, validarCampos, validarRolUsuario } = require("../middlewares/");
const { Router } = require("express");
const { crearProducto, obtenerProductos, obtenerProductoPrecios, actualizarProducto, obtenerProductosPrecios } = require("../controllers/productos");
const { validarIdProducto, existeProducto, existeCategoriaProducto } = require("../helpers/db-validators");

const router = Router();
router.get("/", [
    validarJWT,
    validarCampos
], obtenerProductos);

router.get("/precios", [
    validarJWT,
    validarCampos
], obtenerProductosPrecios);


router.get("/:id", [
    validarJWT,
    check('id').custom(validarIdProducto),
    validarCampos
], obtenerProductoPrecios);

router.post("/", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom(existeProducto),
    check('categoria').isMongoId().not().isEmpty(),
    check('categoria').custom(existeCategoriaProducto),
    check('descripcion', 'No tiene descripcion').notEmpty(),
    validarCampos
], crearProducto);

router.put("/:id", [
    validarJWT,
    check('id').custom(validarIdProducto),
    check('categoria').custom(existeCategoriaProducto),
    validarCampos
], actualizarProducto);



module.exports = router;