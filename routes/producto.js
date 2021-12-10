const express = require('express');
const router = express.Router();

// Metodos del controlador
const { getProductos, postProducto, modificarProducto } = require('../controllers/producto');

// Rutas
router.post('/insertar', postProducto);
router.get('/obtener/todos', getProductos);
router.post('/modificar', modificarProducto);

// route for handling PDF request
router.get("/downloadPDF", (req, res) => {
    res.download("uploads/Resume.pdf");
});

module.exports = router;