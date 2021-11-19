const express = require("express");
const router = express.Router();

// Metodos del controlador
const {
  getOfertasVentaLocal,
  postVentaLocal,
  putEstOfertaP,
  getVentasLocalesS,
  getVentasLocalesUsuario,
  getOfertasProductos
} = require("../controllers/ventaLocal");

// Rutas
router.get("/ofertasVL", getOfertasVentaLocal);
router.get("/aSubastar", getVentasLocalesS);
router.post("/guardar", postVentaLocal);
router.post("/ofertaVL/aceptada", putEstOfertaP);
router.get("/todos/usuario/:idUsuario", getVentasLocalesUsuario);
router.get("/todos/ofertasProductos", getOfertasProductos);

module.exports = router;
