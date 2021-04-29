const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            messg: 'No hay token'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRET);
        req.uid = uid;
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            res.status(401).json({
                mssg: 'usuario no existe-estado: false'
            });
        }
        if (!usuario.estado) {
            res.status(401).json({
                mssg: 'usuario estado: false'
            });
        }
        req.usuario = usuario;
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({
            mssg: 'token no válido'
        })
    }

}
const validarRolUsuario = async (req, res, next) => {
    if (!req.usuario) {
        res.status(500).json({
            mssg: 'Error al validar rol usuario sin token'
        })
    }
    const { rol, nombre } = req.usuario;
    if (!(rol === 'ADMIN_ROLE')) {
        res.status(401).json({
            mssg: `usuario ${nombre} no tiene permisos`
        })
    }
    next();
}

module.exports = {
    validarJWT,
    validarRolUsuario
}