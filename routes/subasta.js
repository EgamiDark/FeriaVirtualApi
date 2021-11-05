const express = require('express');
const router = express.Router();

const { getOfertas,getSubastas,getSubastasD,ingresarOferta,cancelarOferta,modificarOferta } = require('../controllers/subasta');

router.get('/ofertas/:id', getOfertas);
router.get('/subastas', getSubastas);
router.get('/subastasD', getSubastasD);
router.post('/insertarOferta', ingresarOferta);
router.post('/modificarOferta', modificarOferta);
router.post('/cancelarOferta/:id', cancelarOferta);

module.exports = router;