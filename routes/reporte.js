const express = require('express');
const router = express.Router();

// Metodos del controlador
const { prueba } = require('../controllers/reporte');

// Rutas
router.post('/prueba', prueba);

module.exports = router;