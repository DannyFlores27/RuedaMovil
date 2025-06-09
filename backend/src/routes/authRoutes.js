const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
router.get('/perfil', verifyToken, authController.perfil);

module.exports = router;
