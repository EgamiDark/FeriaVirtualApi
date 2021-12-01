const express = require("express");
const router = express.Router();

// Metodos del controlador
const {
  getOfertasVentaLocal,
  postVentaLocal,
  putEstOfertaP,
  getVentasLocalesS,
  getVentasLocalesUsuario,
  getOfertasProductos,
  getEstadosVentas,
  cancelarVentaLocal
} = require("../controllers/ventaLocal");

// Rutas
router.get("/aSubastar", getVentasLocalesS);
router.post("/guardar", postVentaLocal);
router.get("/ofertasVL", getOfertasVentaLocal);
router.post("/ofertaVL/aceptada", putEstOfertaP);
router.post("/ofertaVL/cancelar", cancelarVentaLocal);
router.get("/todos/estadosVenta", getEstadosVentas);
router.get("/todos/usuario/:idUsuario", getVentasLocalesUsuario);
router.get("/todos/ofertasProductos", getOfertasProductos);

module.exports = router;
