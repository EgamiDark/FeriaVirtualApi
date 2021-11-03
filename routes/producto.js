const express = require('express');
const router = express.Router();

// Metodos del controlador
const { getProductos, postProducto, modificarProducto } = require('../controllers/producto');

// Rutas
router.post('/insertar', postProducto);
router.get('/obtener/todos', getProductos);
router.post('/modificar', modificarProducto);

module.exports = router;