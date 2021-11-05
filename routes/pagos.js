const express = require("express");
const router = express.Router();

// Metodos del controlador
const {
  getPagosPedido,
  getPagosVentaLocal
} = require("../controllers/pagos");

// Rutas
router.get('/obtener/pago/pedido/:idUsuario', getPagosPedido);
router.get('/obtener/pago/ventalocal/:idUsuario', getPagosVentaLocal);

module.exports = router;