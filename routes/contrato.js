const express = require("express");
const router = express.Router();

// Metodos del controlador
const { getContratos } = require("../controllers/contrato");

// Rutas
router.get("/obtener/contrato/:idUsuario", getContratos);

module.exports = router;
