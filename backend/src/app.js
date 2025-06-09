const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bicicletaRoutes = require('./routes/bicicletaRoutes');
const terminalRoutes = require('./routes/terminalRoutes'); // ✅
const reportesRoutes = require('./routes/reportesRoutes');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes'); // ✅ NUEVO

const app = express();
const PORT = process.env.PORT || 3351;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/bicicletas', bicicletaRoutes); // ✅ nueva ruta

app.use('/api/auth', authRoutes);
app.use('/api/prestamos', prestamoRoutes); // ✅ NUEVO
app.use('/api/terminales', terminalRoutes); // ✅
app.use('/api/reportes', reportesRoutes);

app.get('/', (req, res) => {
    res.send('RuedaMovil API activa 🚴‍♂️');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
