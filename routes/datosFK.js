const express = require('express');
const router = express.Router();

const { getTipoRefrigeracion,getTipoTransporte, getEstadoPedido, getEstadoSubasta } = require('../controllers/datosFk');

router.get('/tRefrigeracion', getTipoRefrigeracion);
router.get('/tTransporte', getTipoTransporte);
router.get('/estPedido', getEstadoPedido);
router.get('/estSubasta', getEstadoSubasta);

module.exports = router;