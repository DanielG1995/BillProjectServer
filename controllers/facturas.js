const { response, request } = require('express');
const { Factura, Establecimiento, Sucursal } = require('../models');

const obtenerFacturasPorUsuario = async (req = request, res = response) => {
    const { limit = 10 } = req.query;
    const [total, facturas] = await Promise.all([
        Factura.countDocuments({ usuario: req.uid }),
        Factura.find({ usuario: req.uid })
            .populate('usuario', ['nombre', 'correo', '_id'])
            .populate('establecimiento', ['razonSocial', 'ruc'])
            .populate('sucursal', ['direccion', 'numEstab'])
            .limit(Number(limit))]);
    res.json({
        ok: true,
        content: {
            total,
            facturas
        }
    })
}

const obtenerSucursales = async (req = request, res = response) => {
    const { establecimiento } = req.query
    const [sucursales] = await Promise.all([
        (establecimiento) ?
            Sucursal.find({ establecimiento })
                .populate('establecimiento', ['razonSocial', 'ruc']) :
            Sucursal.find()
                .populate('establecimiento', ['razonSocial', 'ruc'])
    ]);
    res.json({
        ok: true,
        content: {
            total:sucursales.length,
            sucursales
        }
    })
}

const obtenerEstablecimientos = async (req = request, res = response) => {
    const [total, establecimientos] = await Promise.all([
        Establecimiento.countDocuments(),
        Establecimiento.find()
    ]);
    res.json({
        ok: true,
        content: {
            total,
            establecimientos
        }
    })
}



module.exports = {
    obtenerFacturasPorUsuario,
    obtenerSucursales,
    obtenerEstablecimientos
}