const { response } = require("express")


const validarArchivo = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            mssg: 'No hay archivos'
        });

    }

    next();

}

module.exports = {
    validarArchivo
}