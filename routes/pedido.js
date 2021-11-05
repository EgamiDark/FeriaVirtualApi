const express = require("express");
const router = express.Router();

// Metodos del controlador
const {
  getPedidoById,
  getPedidos,
  getPedidosUsuario,
  modificarPedido,
  postPedido
} = require("../controllers/pedido");

// Rutas
router.post('/insertar', postPedido);
router.get('/obtener/todos', getPedidos);
router.get('/obtener/pedido/:idPedido', getPedidoById);
router.get('/obtener/todos/usuario/:idUsuario', getPedidosUsuario);
router.post('/modificar', modificarPedido);

module.exports = router;
