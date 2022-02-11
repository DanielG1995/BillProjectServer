const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    descripcion: { type: String },
    codigoPrincipal: { type: String },
    total: { type: Number }
});

ProductoSchema.methods.toJSON = function () {
    const { __v, ...producto } = this.toObject();
    return producto;
}


module.exports = model('Producto', ProductoSchema);