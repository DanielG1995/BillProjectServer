const { check } = require("express-validator");
const { validarJWT, validarCampos } = require("../middlewares/");
const { Router } = require("express");
const { obtenerFacturasPorUsuario, obtenerSucursales, obtenerEstablecimientos } = require("../controllers/Facturas");
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

/* router.get("/:id", [
    validarJWT,
    check('id').custom(validarIdFactura),
    validarCampos
], obtenerFactura);
 */


module.exports = router;