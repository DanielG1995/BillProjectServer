const { Router } = require("express");
const {
  usuariosGet,
  usuariosPut,
  usuariosDelete,
  usuariosPost,
} = require("../controllers/users");
const router = Router();

router.get("/", usuariosGet);
router.put("/", usuariosPut);
router.post("/", usuariosPost);
router.delete("/", usuariosDelete);
module.exports = router;
