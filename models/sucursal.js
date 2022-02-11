const { Schema, model } = require('mongoose');
const SucursalSchema = Schema({

    establecimiento: { type: Schema.Types.ObjectId, ref: 'Establecimiento' },
    numEstab: { type: String },
    direccion: { type: String },


});

SucursalSchema.methods.toJSON = function () {
    const { __v, _id, ...sucursal } = this.toObject();
    sucursal.id = _id;
    return sucursal;
}


module.exports = model('Sucursal', SucursalSchema);