const { Producto } = require("../models");


const obtenerProductos = async (req = request, res = response) => {
    const { limit = 5 } = req.query;
    const [total, producto] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .populate('usuario', ['nombre', 'correo', '_id'])
            .populate('categoria', 'nombre')
            .limit(Number(limit))]);
    return res.json({
        total,
        producto

    })
}
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findOne({ _id: id })
        .populate('usuario', ['nombre', 'correo', '_id'])
        .populate('categoria', 'nombre');
    return res.json({
        producto
    })
}
const crearProducto = async (req, res = response) => {
    const { nombre, descripcion, precio, categoria } = req.body;

    const productoDB = await Producto.findOne({ nombre: nombre.toUpperCase() });
    if (productoDB) {
        return res.status(400).json({
            mssg: `El producto ${nombre} ya existe`
        });
    }

    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id,
        categoria,
        descripcion,
        precio
    }

    const producto = new Producto(data);

    await producto.save();

    return res.status(201).json({
        productoCreado: producto
    })
}

const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombre, ...rest } = req.body;
    if(nombre){
        rest.nombre=nombre.toUpperCase();
    }
    rest.usuario = req.usuario._id;
    const { _id: idProducto } = await Producto.findByIdAndUpdate(id, {...rest});
    const producto = await Producto.findById(idProducto);
    res.json({
        producto
    })
}

//const eliminarProducto = async (req = request, res = response) => {
//    const { id } = req.params;
//    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { next: true });
//    res.json({
//        categoria
//    })
//}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto
}