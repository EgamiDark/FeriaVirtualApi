const express = require('express');
const router =express.Router();

const {getRol,login,registro,getUsuario,getUsuarios, getValidarEmail} = require('../controllers/auth');

router.get('/rol', getRol);
router.get('/login', login);
router.get('/usuario/:id', getUsuario);
router.get('/usuarios', getUsuarios);
router.get('/validarEmail/:email', getValidarEmail);
router.post('/registro', registro);

module.exports = router;