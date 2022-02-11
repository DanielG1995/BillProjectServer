const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    numeroAutorizacion: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaAutorizacion: {
        type: String,

    },
    fechaEmision: {
        type: Date
    },
    establecimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Establecimiento',
    },
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursal',
    },
    totalSinImpuesto: {
        type: Number,
        default: 0
    },
    totalDescuento: {
        type: Number,
        default: 0
    },
    totalImpuesto: {
        type: [],
        default: []
    },
    importeTotal: {
        type: Number,
        default: 0
    },
    detalles: {
        type: [],
    }

});

FacturaSchema.methods.toJSON = function () {
    const { __v, _id, ...factura } = this.toObject();
    factura.id = _id;
    return factura;
}


module.exports = model('Factura', FacturaSchema);