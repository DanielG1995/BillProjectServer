const { Schema, model } = require('mongoose');

const EstablecimientoSchema = Schema({

    ruc: { type: String },
    razonSocial: { type: String },
    dirMatriz: { type: String },


});

EstablecimientoSchema.methods.toJSON = function () {
    const { __v, _id, ...establecimiento } = this.toObject();
    establecimiento.id = _id;
    return establecimiento;
}


module.exports = model('Establecimiento', EstablecimientoSchema);