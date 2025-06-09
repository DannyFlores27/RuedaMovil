const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');
const verifyToken = require('../middleware/verifyToken'); // ✅

router.post('/reservar', verifyToken, prestamoController.reservar); // ✅ protegida
router.post('/modificar-destino', verifyToken, prestamoController.modificarDestino); // ✅
router.post('/devolver', verifyToken, prestamoController.devolver);

router.get('/historial', verifyToken, prestamoController.verHistorial);



module.exports = router;
