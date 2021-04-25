const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosGet,
  usuariosPut,
  usuariosDelete,
  usuariosPost,
} = require("../controllers/users");
const { esRolValido, emailExiste } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();
router.get("/", usuariosGet);
router.put("/:id", usuariosPut);
router.post("/",[
  check('correo','No es valido').isEmail(),
  check('correo').custom(emailExiste),
  check('nombre','Es obligatorio').not().isEmpty(),
  check('password','Es obligatorio, mas de 6 letras').isLength({min:6}),
  check('rol').custom(esRolValido),
  validarCampos
] ,usuariosPost);
router.delete("/", usuariosDelete);
module.exports = router;
