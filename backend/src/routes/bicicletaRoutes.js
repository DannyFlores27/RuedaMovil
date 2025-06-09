const express = require('express');
const router = express.Router();
const bicicletaController = require('../controllers/bicicletaController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin'); // ✅ nuevo middleware

// Solo administradores pueden agregar, retirar o enviar a mantenimiento
router.post('/', verifyToken, verifyAdmin, bicicletaController.agregar);
router.put('/:id/retirar', verifyToken, verifyAdmin, bicicletaController.retirar);
router.put('/:id/mantenimiento', verifyToken, verifyAdmin, bicicletaController.mandarAMantenimiento);
router.get('/disponibles/:id_terminal', bicicletaController.verDisponibilidad);


module.exports = router;
