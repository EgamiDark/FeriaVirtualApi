const express = require("express");
const router = express.Router();

const {
  getTipoRefrigeracion,
  getTipoTransporte,
  getEstadoPedido,
  getEstadoSubasta,
  getEstadoOfertaSub,
  getEstadoOfertaProd,
  getEstadoPago
} = require("../controllers/datosFk");

router.get("/tRefrigeracion", getTipoRefrigeracion);
router.get("/tTransporte", getTipoTransporte);
router.get("/estPedido", getEstadoPedido);
router.get("/estSubasta", getEstadoSubasta);
router.get("/estOfertaSub", getEstadoOfertaSub);
router.get("/estOfertaProd", getEstadoOfertaProd);
router.get("/estPago", getEstadoPago);

module.exports = router;
