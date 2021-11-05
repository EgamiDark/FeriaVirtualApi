const express = require('express');
const router = express.Router();

const { getTipoRefrigeracion,getTipoTransporte, getEstadoPedido } = require('../controllers/datosFk');

router.get('/tRefrigeracion', getTipoRefrigeracion);
router.get('/tTransporte', getTipoTransporte);
router.get('/estPedido', getEstadoPedido);

module.exports = router;