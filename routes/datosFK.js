const express = require("express");
const router = express.Router();

const {
  getTipoRefrigeracion,
  getTipoTransporte,
  getEstadoPedido,
  getEstadoSubasta,
  getEstadoOferta,
  getEstadoPago
} = require("../controllers/datosFk");

router.get("/tRefrigeracion", getTipoRefrigeracion);
router.get("/tTransporte", getTipoTransporte);
router.get("/estPedido", getEstadoPedido);
router.get("/estSubasta", getEstadoSubasta);
router.get("/estOferta", getEstadoOferta);
router.get("/estPago", getEstadoPago);

module.exports = router;
