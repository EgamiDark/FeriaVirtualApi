const express = require('express');
const router =express.Router();

const {getRol,login,registro,getUsuario,getUsuarios} = require('../controllers/auth');

router.get('/rol', getRol);
router.get('/login', login);
router.get('/usuario', getUsuario);
router.get('/usuarios', getUsuarios);
router.post('/registro', registro);

module.exports = router;