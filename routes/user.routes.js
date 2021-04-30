const { Router } = require("express");
const { check } = require("express-validator");
const{
  validarCampos,
  validarJWT,
  validarVariosRoles
}=require('../middlewares');

const {
usuariosGet,
  usuariosPut,
  usuariosDelete,
  usuariosPost,
} = require("../controllers/users");
const { esRolValido, emailExiste, existeUsuarioId } = require("../helpers/db-validators");
const router = Router();
router.get("/", usuariosGet);
router.put("/:id", [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existeUsuarioId),
  check('rol').custom(esRolValido),
  validarCampos
], usuariosPut);
router.post("/", [
  check('correo', 'No es valido').isEmail(),
  check('correo').custom(emailExiste),
  check('nombre', 'Es obligatorio').not().isEmpty(),
  check('password', 'Es obligatorio, mas de 6 letras').isLength({ min: 6 }),
  check('rol').custom(esRolValido),
  validarCampos
], usuariosPost);
router.delete("/:id", [
  validarJWT,
 // validarRolUsuario,
  validarVariosRoles('ADMIN_ROLE','VENTAS_ROLE','USER_ROLE'),
  check('id', 'No es un id vàlido').isMongoId(),
  check('id').custom(existeUsuarioId),
  validarCampos
], usuariosDelete);
module.exports = router;
