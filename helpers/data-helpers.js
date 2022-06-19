const moment = require('moment')
const { Producto, Establecimiento, Sucursal, Precio } = require('../models/index');


//Recorre los productos y verifica si ya se encuentran registrados
const verificarProductos = async (productos = [], establecimiento, sucursal, fechaRegistro, factura) => {
    for (const producto of productos) {
        let prodBD = await Producto.findOne({ codigoPrincipal: `${producto.codigoPrincipal}` });
        if (!prodBD) {
            const {
                descripcion,
                codigoPrincipal,
            } = producto
            prodBD = new Producto({ descripcion, codigoPrincipal, total: 0 });
            await prodBD.save();
        }
        const dataPrecio = {
            establecimiento,
            sucursal,
            producto: prodBD._id,
            codigoPrincipal:prodBD?.codigoPrincipal,
            precioUnitario: producto.precioUnitario,
        }
        let precio = await Precio.findOne(dataPrecio)
        if (!precio) {
            precio = new Precio({
                fechaRegistro,
                iva: producto.impuestos.impuesto.valor,
                factura,
                ...dataPrecio
            });
            await precio.save();
        }
        const total = prodBD.total + (producto.cantidad || 1);
        await prodBD.updateOne({ total })

    }
}

//Genera Objeto para guardar a la BD
const armarObjetoFactura = async (facturaXML = {}) => {
    try {
        let sucursal = {};
        const autorizacion = facturaXML.autorizacion;
        const { comprobante: { factura: { detalles='', infoTributaria, infoFactura } } } = autorizacion;
        const fechaEmision = moment(infoFactura.fechaEmision.trim(), 'DD/MM/YYYY ').valueOf();
        // const fechaEmision = Date.parse(infoFactura.fechaEmision.trim());
        let establecimientoBD = await Establecimiento.findOne({ ruc: infoTributaria.ruc })
        if (!establecimientoBD) { //Existe Establecimiento
            const estab = new Establecimiento({
                ruc: infoTributaria.ruc,
                razonSocial: infoTributaria.razonSocial,
                dirMatriz: infoTributaria.dirMatriz,
            })
            const { _id } = await estab.save();
            establecimientoBD = { id: _id }
            sucursal = await crearSucursal(_id, infoFactura.dirEstablecimiento, infoTributaria.estab)
        } else {
            sucursal = await Sucursal.findOne({ establecimiento: establecimientoBD._id, numEstab: infoTributaria.estab })
            if (!sucursal) { //Existe Sucursal
                sucursal = {}
                const { _id } = await crearSucursal(establecimientoBD._id, infoFactura.dirEstablecimiento, infoTributaria.estab);
                sucursal._id = _id;
            }

        }
        console.log(sucursal);
        return {
            facturaMongo: {
                numeroAutorizacion: autorizacion.numeroAutorizacion,
                fechaAutorizacion: autorizacion.fechaAutorizacion,
                fechaEmision,
                establecimiento: establecimientoBD?.id,
                sucursal: sucursal?._id,
                totalSinImpuesto: infoFactura.totalSinImpuestos,
                totalDescuento: infoFactura.totalDescuento,
                totalImpuesto: infoFactura.totalConImpuestos.totalImpuesto,
                importeTotal: infoFactura.importeTotal,
                detalles: detalles.detalle,
            },
            ok: true,
            msg: ''
        }
    } catch (error) {
        return {
            ok: false,
            msg: error
        }
    }

}

const crearSucursal = (establecimiento, direccion, numEstab) => {
    const sucursal = new Sucursal({
        establecimiento,
        direccion,
        numEstab
    });
    return sucursal.save();
}

module.exports = {
    armarObjetoFactura,
    verificarProductos
}