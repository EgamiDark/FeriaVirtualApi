const express = require('express');
const router =express.Router();

const {getRol,login,registro,getUsuario,getUsuarios, getValidarEmail, modificarUsuario} = require('../controllers/auth');

router.get('/rol', getRol);
router.post('/login', login);
router.get('/usuario/:id', getUsuario);
router.get('/usuarios', getUsuarios);
router.get('/validarEmail/:email', getValidarEmail);
router.post('/registro', registro);
router.post('/modificar',modificarUsuario);

module.exports = router;