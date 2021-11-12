const express = require("express");
const router = express.Router();

// Metodos del controlador
const { getOfertasVentaLocal, postVentaLocal, putEstOfertaP } = require("../controllers/ventaLocal");

// Rutas
router.get("/ofertasVL", getOfertasVentaLocal);
router.post("/guardar", postVentaLocal);
router.post("/ofertaVL/aceptada", putEstOfertaP);

module.exports = router;
