const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Producto, Categoria } = require('../models');
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMondoID = isValidObjectId(termino);
    if (esMondoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        count: usuarios.length,
        results: (usuarios) ? [usuarios] : []
    })
}
const buscarCategorias = async (termino = '', res = response) => {
    const esMondoID = isValidObjectId(termino);
    if (esMondoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
    });
    res.json({
        count: categorias.length,
        results: (categorias) ? [categorias] : []
    })
}
const buscarProducto = async (termino = '', res = response) => {
    const esMondoID = isValidObjectId(termino);
    if (esMondoID) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ nombre: regex }],
    });
    res.json({
        count: productos.length,
        results: (productos) ? [productos] : []
    })
}
const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {

        return res.status(400).json({
            msg: 'Error Url'
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProducto(termino, res);
            break;
        case 'roles':
            break;

    }

}

module.exports = {
    buscar
}