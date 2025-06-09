const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/resumen', verifyToken, verifyAdmin, reportesController.obtenerResumen);

module.exports = router;
