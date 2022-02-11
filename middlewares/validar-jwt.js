const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(200).json({
            ok: false,
            msg: 'No hay token'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRET);
        req.uid = uid;
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            res.status(200).json({
                msg: 'usuario no existe-estado: false'
            });
        }
        if (!usuario.estado) {
            res.status(200).json({
                msg: 'usuario estado: false'
            });
        }
        req.usuario = usuario;
        next();
    } catch (err) {
        res.status(200).json({
            ok: false,
            msg: 'La sesión ha expirado'
        })
    }

}
const validarRolUsuario = async (req, res, next) => {
    if (!req.usuario) {
        res.status(500).json({
            msg: 'Error al validar rol usuario sin token'
        })
    }
    const { rol, nombre } = req.usuario;
    if (!(rol === 'ADMIN_ROLE')) {
        res.status(200).json({
            mssg: `usuario ${nombre} no tiene permisos`
        })
    }
    next();
}
const validarVariosRoles = (...roles) => {

    return (req, res, next) => {
        if (roles.includes(req.usuario.rol)) {
            next();
        } else {
            res.status(200).json({
                mssg: `Usuario ${req.usuario.nombre} no tiene ningun permiso para borrar`
            })
        }
    }

}

module.exports = {
    validarJWT,
    validarRolUsuario,
    validarVariosRoles
}