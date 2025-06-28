const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bicicletaRoutes = require('./routes/bicicletaRoutes');
const terminalRoutes = require('./routes/terminalRoutes'); // ✅
const reportesRoutes = require('./routes/reportesRoutes');
const authRoutes = require('./routes/authRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes'); // ✅ NUEVO

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3351;

// Configuración CORS
app.use(cors({
  origin: 'https://uniondeprofesionales.com', // Cambia a '*' para pruebas locales si quieres
  credentials: true,
}));

// Parsear JSON en requests
app.use(bodyParser.json());

// Rutas API
app.use('/api/bicicletas', bicicletaRoutes); // ✅ nueva ruta
app.use('/api/auth', authRoutes);
app.use('/api/prestamos', prestamoRoutes); // ✅ NUEVO
app.use('/api/terminales', terminalRoutes); // ✅
app.use('/api/reportes', reportesRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('RuedaMovil API activa 🚴‍♂️');
});

// Iniciar servidor en 0.0.0.0 para aceptar conexiones externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

