const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: '2d'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generar el WebToken')
            } else {
                resolve(token);
            }
        })


    });
}

const validarTokenCliente = async(token = '') => {
    try {
        const { uid } = jwt.verify(token, process.env.SECRET);
        if (!uid) {
            return null;
        }
        const usuario =await Usuario.findById(uid);
         if (usuario) {
            if (usuario.estado) {
                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (err) {
        console.log(err)
        return null;
    }
}

module.exports = {
    generarJWT,
    validarTokenCliente
}