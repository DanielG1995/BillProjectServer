const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleLogin } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();

router.post("/login",[
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La constrasenia es obligatoria").not().isEmpty(),
    validarCampos],
  login
);

router.post("/google", [
  check("id_token", "El id Token es necesario").not().isEmpty(),
  validarCampos],
  googleLogin
);

module.exports = router;
