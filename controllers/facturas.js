var mongoose = require('mongoose');
const { response, request } = require('express');
const { Factura, Establecimiento, Sucursal, Producto } = require('../models');

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
            total: sucursales.length,
            sucursales
        }
    })
}

const obtenerEstablecimientos = async (req = request, res = response) => {
    const [total, establecimientos] = await Promise.all([
        Factura.countDocuments(),
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

const obtenerDatosGeneralesPorUsuario = async (req = request, res = response) => {
    let establecimiento
    const [total, establecimientos, producto, totalGastado, yearMonth, year] = await Promise.all([
        Factura.countDocuments({ usuario: req.uid }),
        Factura.aggregate(
            [
                {
                    "$match": {
                        "usuario": mongoose.Types.ObjectId(req.uid)
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "establecimiento": "$establecimiento"
                        },
                        "COUNT(establecimiento)": {
                            "$sum": 1
                        }
                    }
                },
                {
                    "$project": {
                        "establecimiento": "$_id.establecimiento",
                        "total": { $max: "$COUNT(establecimiento)" },
                        "_id": 0
                    }
                }
            ]
        ),
        Producto.aggregate(
            [
                {
                    "$project": {
                        "_id": 0,
                        "productos": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "productos.non_existing_field",
                        "from": "precios",
                        "foreignField": "non_existing_field",
                        "as": "precios"
                    }
                },
                {
                    "$unwind": {
                        "path": "$precios",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "productos.non_existing_field",
                        "from": "facturas",
                        "foreignField": "non_existing_field",
                        "as": "facturas"
                    }
                },
                {
                    "$unwind": {
                        "path": "$facturas",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$match": {
                        "$and": [
                            {
                                "$expr": {
                                    "$eq": [
                                        "$precios.codigoPrincipal",
                                        "$productos.codigoPrincipal"
                                    ]
                                }
                            },
                            {
                                "$expr": {
                                    "$eq": [
                                        "$facturas._id",
                                        "$precios.factura"
                                    ]
                                }
                            },
                            {
                                "$expr": {
                                    "$eq": [
                                        "$facturas.usuario",
                                        mongoose.Types.ObjectId(req.uid)
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "$sort": {
                        "productos.total": -1
                    }
                },
                {
                    "$project": {
                        "productos.descripcion": "$productos.descripcion",
                        "productos.total": "$productos.total",
                        "_id": 0
                    }
                },
                {
                    "$limit": 1
                }
            ]),
        Factura.aggregate([
            {
                "$match": {
                    "usuario": mongoose.Types.ObjectId(req.uid)
                }
            },
            {
                "$group": {
                    "_id": {

                    },
                    "SUM(importeTotal)": {
                        "$sum": "$importeTotal"
                    }
                }
            },
            {
                "$project": {
                    "gastoTotal": "$SUM(importeTotal)",
                    "_id": 0
                }
            }
        ]),
        Factura.aggregate([
            {
                "$match": {
                    "usuario": mongoose.Types.ObjectId(req.uid)
                }
            }
            , {
                "$group": {
                    "_id": {
                        "mes": { "$month": "$fechaEmision" },
                        "year": { "$year": "$fechaEmision" },
                    },
                    "SUM(importeTotal)": {
                        "$sum": "$importeTotal"
                    },
                    "ByYearAndMonth": { "$sum": 1 }

                }
            }, {
                $project: {
                    "month": "$_id.mes",
                    "year": "$_id.year",
                    "total": "$ByYearAndMonth",
                    "totalPrice": "$SUM(importeTotal)",
                    "_id": 0
                }
            }
        ]),
        Factura.aggregate([
            {
                "$match": {
                    "usuario": mongoose.Types.ObjectId(req.uid)
                }
            }
            , {
                "$group": {
                    "_id": {
                        "year": { "$year": "$fechaEmision" }
                    },
                    "byYear": { "$sum": 1 },
                    "SUM(importeTotal)": {
                        "$sum": "$importeTotal"
                    },

                }
            }, {
                $project: {
                    "year": "$_id.year",
                    "total": "$byYear",
                    "totalPrice": "$SUM(importeTotal)",
                    "_id": 0
                }
            }
        ])

    ]);

    if (establecimientos.length > 0) {
        establecimiento = await Establecimiento.findById(establecimientos.sort((a, b) => {
            return Number.parseInt(b.total) - Number.parseInt(a.total)
        })[0]?.establecimiento)
    }
    res.json({
        ok: true,
        content: {
            total,
            establecimiento,
            producto: { ...producto?.[0]?.productos },
            totalGastado: { ...totalGastado?.[0] },
            yearMonth,
            year

        }
    })
}



module.exports = {
    obtenerFacturasPorUsuario,
    obtenerSucursales,
    obtenerEstablecimientos,
    obtenerDatosGeneralesPorUsuario
}