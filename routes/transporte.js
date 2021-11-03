const express = require('express');
const router = express.Router();

// Metodos del controlador
const { 
    getTransportes, 
    modificarTransporte, 
    postTransporte, 
    actividadTransporte,
    getTransporte
} = require("../controllers/transporte");

// Rutas
router.post('/insertar', postTransporte);
router.get('/obtener/todos', getTransportes);
router.get('/obtener/transporte', getTransporte);
router.post('/modificar', modificarTransporte);
router.post('/modificar/actividad', actividadTransporte);

module.exports = router;