const express = require('express');
const router = express.Router();

const { getOfertas,getSubastas,getSubastasD,ingresarOferta,cancelarOferta,modificarOferta, getOferta, ingresarSubasta, getOfertasIdSubasta, getSubasta } = require('../controllers/subasta');

router.get('/ofertas/:id', getOfertas);
router.get('/oferta/:id', getOferta);
router.get('/ofertas/subasta/:id', getOfertasIdSubasta);
router.get('/subasta/:id', getSubasta);
router.get('/subastas', getSubastas);
router.get('/subastasD', getSubastasD);
router.post('/insertarSubasta', ingresarSubasta);
router.post('/insertarOferta', ingresarOferta);
router.post('/modificarOferta', modificarOferta);
router.post('/cancelarOferta/:id', cancelarOferta);

module.exports = router;