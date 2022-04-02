const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const { response, request } = require("express");

const { subirArchivo } = require("../helpers/uploads-validators");
const { Usuario, Producto } = require('../models');
const { obtenerDataFile } = require('../helpers/factura-leer');
const Factura = require('../models/factura');
const { armarObjetoFactura, verificarProductos } = require('../helpers/data-helpers');
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

const guardarInfoFactura = async (file, uid) => {
    const resp = await obtenerDataFile(file?.tempFilePath);
    if (!resp.ok) {
        return {
            ok: false,
            content: file.name,
            msg: 'Error al leer el archivo'
        }
    }
    if (!resp?.factura?.factura?.autorizacion?.comprobante?.factura?.detalles) {
        console.log(resp);
        return {
            ok: false,
            content: file.name,
            msg: 'Formato no compatible',
            factura: resp
        }
    }
    const existeFactura = await Factura.findOne({ numeroAutorizacion: resp?.factura?.factura?.autorizacion?.numeroAutorizacion })
    if (existeFactura) {
        return {
            ok: false,
            content: file.name,
            msg: 'La factura ya se encuentra registrada'
        }
    }
    const { facturaMongo, ok, msg } = await armarObjetoFactura(resp.factura.factura);
     if (!ok) {
        return {
            ok: false,
            content: file.name,
            msg
        }
    }
    facturaMongo.usuario = uid;
    const factura = new Factura(facturaMongo);
    await factura.save();
    verificarProductos((facturaMongo.detalles.length)
        ? facturaMongo.detalles :
        [facturaMongo.detalles],
        facturaMongo.establecimiento,
        facturaMongo.sucursal,
        facturaMongo.fechaEmision,
        factura?._id)

    return factura;
}

const leerFacturas = async (req = request, res = response) => {
    const { uid } = req;
    const facturasSubidas = []
    if (req?.files?.factura?.length) {
        for (const file of req?.files?.factura) {
            let factura = await guardarInfoFactura(file, uid);
            facturasSubidas.push(factura);
        }
    } else {
        let factura = await guardarInfoFactura(req?.files?.factura, uid);
        facturasSubidas.push(factura);
    }
    res.json({
        ok: true,
        content: facturasSubidas
    })

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
    mostrarImagenCloudinary,
    leerFacturas
}

