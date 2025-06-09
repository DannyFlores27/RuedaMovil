const db = require('../config/db');

exports.obtenerResumen = async (req, res) => {
  try {
    const [prestamos] = await db.query('SELECT COUNT(*) AS total FROM prestamo');
    const [bicicletas] = await db.query('SELECT COUNT(*) AS total FROM bicicleta WHERE estado = "disponible"');
    const [mantenimiento] = await db.query('SELECT COUNT(*) AS total FROM bicicleta WHERE estado = "mantenimiento"');
    const [terminales] = await db.query('SELECT COUNT(*) AS total FROM terminal');
    const [usuarios] = await db.query('SELECT COUNT(*) AS total FROM usuario');

    res.status(200).json({
      total_prestamos: prestamos[0].total,
      bicicletas_disponibles: bicicletas[0].total,
      bicicletas_mantenimiento: mantenimiento[0].total,
      terminales: terminales[0].total,
      usuarios: usuarios[0].total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener resumen', error });
  }
};
