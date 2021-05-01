const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    imagen: {
        type: String,
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true }
});

ProductoSchema.methods.toJSON = function () {
    const { __v, _id, ...producto } = this.toObject();
    producto.id = _id;
    return producto;
}


module.exports = model('Producto', ProductoSchema);