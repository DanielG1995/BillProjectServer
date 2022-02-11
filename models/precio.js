const { Schema, model } = require('mongoose');

const PrecioSchema = Schema({
    establecimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Establecimiento',
        required: true
    },
    factura: {
        type: Schema.Types.ObjectId,
        ref: 'Factura',
    },
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursal',
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    fechaRegistro: { type: Date },
    precioUnitario: { type: Number },
    iva: { type: Number }
});

PrecioSchema.methods.toJSON = function () {
    const { __v, _id, ...precio } = this.toObject();
    precio.id = _id;
    return precio;
}


module.exports = model('Precio', PrecioSchema);