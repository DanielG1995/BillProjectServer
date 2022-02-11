const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, mostrarImagenCloudinary,actualizarImagenCloudinary, leerFacturas } = require('../controllers/uploads');
const { validarColeccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivo, validarJWT } = require('../middlewares');

const router = Router();

router.post('/', [validarArchivo], cargarArchivo);

router.post('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, [ 'facturas'])),
    validarCampos
], actualizarImagenCloudinary);

router.post('/facturas', [
    validarJWT,
    validarArchivo,
    validarCampos
], leerFacturas);


router.get('/:coleccion/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, [ 'facturas'])),
    validarCampos
], mostrarImagenCloudinary);

module.exports = router;