const express = require("express");
const router = express.Router();

// Metodos del controlador
const {
  getOfertasVentaLocal,
  postVentaLocal,
  putEstOfertaP,
  getVentasLocalesUsuario,
} = require("../controllers/ventaLocal");

// Rutas
router.get("/ofertasVL", getOfertasVentaLocal);
router.post("/guardar", postVentaLocal);
router.post("/ofertaVL/aceptada", putEstOfertaP);
router.get("/todos/usuario/:idUsuario", getVentasLocalesUsuario);

module.exports = router;
