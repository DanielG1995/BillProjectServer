const { response, request } = require('express');
const { Categoria } = require('../models');

const obtenerCategorias = async (req = request, res = response) => {
    const { limit = 5 } = req.query;
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true }).populate('usuario', ['nombre', 'correo', '_id'])
            .limit(Number(limit))]);
    return res.json({
        total,
        categorias
    })
}
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findOne({ _id: id }).populate('usuario', ['nombre', 'correo', '_id']);
    return res.json({
        categoria
    })
}
const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            mssg: `La categoria ${nombre} ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    return res.status(201).json({
        categoria
    })
}

const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const { _id: idCategoria } = await Categoria.findByIdAndUpdate(id, { nombre: nombre.toUpperCase() });
    const categoria = await Categoria.findById(idCategoria);
    res.json({
        categoria
    })
}

const eliminarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { next: true });
    res.json({
        categoria
    })
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}