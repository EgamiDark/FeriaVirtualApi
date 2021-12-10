const express = require("express");
const router = express.Router();

// Metodos del controlador
const { getContratos, getAllContratos, insertarContrato } = require("../controllers/contrato");

// Rutas
router.get("/obtener/contrato/:idUsuario", getContratos);
router.get("/obtener/todos", getAllContratos);
router.post("/insertar", insertarContrato);

module.exports = router;
