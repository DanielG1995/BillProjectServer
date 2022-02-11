const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(200).json({
                ok: false,
                msg: 'Las credenciales no son correctas',
            });
        }
        if (!usuario.estado) {
            return res.status(200).json({
                ok: false,
                msg: 'El usuario se encuentra bloqueado'
            });
        }
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(200).json({
                ok: false,
                msg: 'Las Credenciales no son correctas'
            });
        }
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: '',
            token,
            user: {
                nombre: usuario.nombre,
                uid: usuario.id
            }
        })

    } catch (err) {

    }

}

const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        const { correo, nombre, img } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: '>:v',
                img,
                google: true,
                rol: 'USER_ROLE'
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                mssg: 'Usuario google bloqueado'
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            mssg: 'todo bien google',
            usuario,
            token
        })

    } catch (err) {
        res.status(400).json({
            mssg: 'Token Google no reconocido',
            err
        })
    }

}

const validarToken = async (req, res = response) => {
    const { usuario } = req;
    const token = await generarJWT(usuario.id);
    res.json({
        ok: true,
        content: {
            usuario,
            token
        }
    })
}

module.exports = {
    login,
    googleLogin,
    validarToken
}