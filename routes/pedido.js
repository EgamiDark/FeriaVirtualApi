const express = require("express");
const router = express.Router();

// Metodos del controlador
const {
  getPedidoById,
  getPedidos,
  getPedidosD,
  getPedidosUsuario,
  modificarPedido,
  postPedido,
  getOfertas,
  getOferta
} = require("../controllers/pedido");

// Rutas
router.get('/ofertas/:id', getOfertas);
router.get('/oferta/:id', getOferta);
router.post('/insertar', postPedido);
router.get('/obtener/todos', getPedidos);
router.get('/obtener/disponibles', getPedidosD);
router.get('/obtener/pedido/:idPedido', getPedidoById);
router.get('/obtener/todos/usuario/:idUsuario', getPedidosUsuario);
router.post('/modificar', modificarPedido);

module.exports = router;
