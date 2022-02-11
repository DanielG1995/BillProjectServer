const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleLogin, validarToken } = require("../controllers/auth");
const { validarCampos, validarJWT } = require("../middlewares/");


const router = Router();

router.get('/', [
  validarJWT,
  validarCampos
], validarToken);

router.post("/login", [
  check("correo", "El correo es obligatorio").isEmail(),
  check("password", "La constraseña es obligatoria").not().isEmpty(),
  validarCampos],
  login
);

router.post("/google", [
  check("id_token", "El id Token es necesario").not().isEmpty(),
  validarCampos],
  googleLogin
);

module.exports = router;
