const validaCampos = require("../middlewares/validar-campos");
const validaJWT = require("../middlewares/validar-jwt");
const validarArchivo= require('./validar-archivo')
module.exports={
    ...validaCampos,
    ...validaJWT,
    ...validarArchivo
}