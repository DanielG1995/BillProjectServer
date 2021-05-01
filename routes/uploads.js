const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, mostrarImagenCloudinary,actualizarImagenCloudinary } = require('../controllers/uploads');
const { validarColeccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivo } = require('../middlewares');

const router = Router();

router.post('/', [validarArchivo], cargarArchivo);

router.post('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagenCloudinary);

module.exports = router;