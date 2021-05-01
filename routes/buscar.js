const { Router } = require('express');
const { buscar } = require('../controllers/buscar');
const { validarCampos } = require('../middlewares');

const router = Router();

router.get('/:coleccion/:termino', buscar);

module.exports =router;