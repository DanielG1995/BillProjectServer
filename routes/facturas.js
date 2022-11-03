const { check } = require("express-validator");
const { validarJWT, validarCampos } = require("../middlewares/");
const { Router } = require("express");
const { obtenerFacturasPorUsuario, obtenerSucursales, obtenerEstablecimientos, obtenerDatosGeneralesPorUsuario } = require("../controllers/facturas");
//const { validarIdFactura } = require("../helpers/db-validators");

const router = Router();

router.get("/", [
    validarJWT,
    validarCampos
], obtenerFacturasPorUsuario);

router.get("/sucursales", [
    validarJWT,
    check('establecimiento').optional().isMongoId(),
    validarCampos
], obtenerSucursales);

router.get("/estab", [
    validarJWT,
    validarCampos
], obtenerEstablecimientos);

router.get("/datosGenerales", [
    validarJWT,
    validarCampos,
    check('usuarioId').optional().isMongoId(),
], obtenerDatosGeneralesPorUsuario);

/* router.get("/:id", [
    validarJWT,
    check('id').custom(validarIdFactura),
    validarCampos
], obtenerFactura);
 */


module.exports = router;