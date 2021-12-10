const express = require('express');
const router = express.Router();

// Metodos del controlador
const { reporte, getReportes} = require('../controllers/reporte');

// Rutas
router.post('/reporte', reporte);
router.get('/reportes', getReportes);

module.exports = router;