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
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos',
            });
        }
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Password'
            });
        }
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login',
            token
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

module.exports = {
    login,
    googleLogin
}