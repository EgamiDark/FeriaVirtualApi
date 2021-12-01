const express = require("express");
const router = express.Router();

// Metodos del controlador
const {
  getPagosPedido,
  getPagosVentaLocal,
  cambiaEstadoPago
} = require("../controllers/pagos");

// Rutas
router.get('/obtener/pago/pedido/:idUsuario', getPagosPedido);
router.get('/obtener/pago/ventalocal/:idUsuario', getPagosVentaLocal);
router.post('/cambiaEstPago', cambiaEstadoPago)

module.exports = router;