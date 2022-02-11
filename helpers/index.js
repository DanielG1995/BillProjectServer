const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const uploadsValidators = require('./uploads-validators');
const dataHelpers = require('./data-helpers');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadsValidators,
    ...dataHelpers
}