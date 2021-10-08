const express = require('express');
const router = express.Router();

const { getProductos, postProducto, modificarProducto } = require('../controllers/producto');

router.post('/insertar', postProducto);
router.get('/obtener/todos', getProductos);
router.post('/modificar', modificarProducto);

module.exports = router;