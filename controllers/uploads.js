const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const { response, request } = require("express");

const { subirArchivo } = require("../helpers/uploads-validators");
const { Usuario, Producto } = require('../models');

const pathNoImage = path.join(__dirname, '../img/no-image.jpg');


const cargarArchivo = async (req = request, res = response) => {

    const nombreArchivo = await subirArchivo(req.files);
    res.json({
        fileName: nombreArchivo

    });


}

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'No se valido'
            });
    }

    if (modelo.imagen) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.imagen);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.imagen = nombreArchivo;
    await modelo.save();
    res.json({
        modelo

    });


}

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'No se valido'
            });
    }

    if (modelo.imagen) {
        const nombreArr = modelo.imagen.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { secure_url } = await cloudinary.uploader.upload(req.files.archivo.tempFilePath);
    modelo.imagen = secure_url;
    await modelo.save();
    res.json({
        modelo

    });


}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'No se valido'
            });
    }

    if (modelo.imagen) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.imagen);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }
    return res.sendFile(pathNoImage)

}

const mostrarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    mssg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'No se valido'
            });
    }

    if (modelo.imagen) {
        return res.json({
            img: modelo.imagen
        });
    }
    return res.sendFile(pathNoImage)


}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
    mostrarImagenCloudinary
}

