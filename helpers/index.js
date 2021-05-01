const dbValidators =require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const uploadsValidators = require('./uploads-validators');

module.exports={
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadsValidators
}