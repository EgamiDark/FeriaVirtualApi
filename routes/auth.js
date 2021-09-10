const express = require('express');
const router =express.Router();

const {getRol,login,registro} = require('../controllers/auth');

router.get('/rol', getRol);
router.get('/login', login);
router.post('/registro', registro);

module.exports = router;