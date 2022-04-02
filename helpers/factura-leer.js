const parser = require('fast-xml-parser');
const he = require('he');
const fs = require('fs')


const options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: true,
    trimValues: true,
    cdataTagName: "cdata", //default is 'false'
    //cdataPositionChar: "\\c",
    parseTrueNumberOnly: true,
    arrayMode: false, //"strict"
    // attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
    // tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"]
};

const leerDataXML = (xmlData = '') => {
    try {
        if (parser.validate(xmlData) === true) {
            let jsonObj = parser.parse(xmlData, options);
            //Validacion de facturas validadas en el SRI
            if (parser.validate(jsonObj?.autorizacion?.comprobante?.cdata?.trim() || '') === true) {
                const cdataJson = parser.parse(jsonObj?.autorizacion?.comprobante?.cdata, options);
                delete jsonObj.autorizacion.comprobante.cdata;
                delete cdataJson.factura['ds:Signature'];
                jsonObj.autorizacion.comprobante = cdataJson;
            }
            //Validacion para facturas que aun no han sido registradas en el SRI
            if (!jsonObj?.autorizacion) {
                delete jsonObj?.factura['ds:Signature'];
                jsonObj = {
                    ...jsonObj.factura,
                    autorizacion: {
                        comprobante: { factura: { ...jsonObj.factura } },
                        numeroAutorizacion: jsonObj?.factura?.infoTributaria?.claveAcceso
                    }
                };
            }
            return { ok: true, factura: jsonObj }
        } else {
            return '';
        }

    } catch (error) {
        return {
            ok: false,
            msg: error
        }
    }

}


const obtenerDataFile = (path = '') => {

    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject({ ok: false, msg: err });
            }
            factura = leerDataXML(data);
            resolve({ ok: true, factura });
        });
    })

}

module.exports = {
    leerDataXML,
    obtenerDataFile
}




// Intermediate obj
//var tObj = parser.getTraversalObj(xmlData, options);
//var jsonObj = parser.convertToJson(tObj, options);