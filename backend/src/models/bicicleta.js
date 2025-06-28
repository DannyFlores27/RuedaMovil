const db = require('../config/db');

const Bicicleta = {
  // Obtener una bicicleta disponible en una terminal
  async obtenerDisponibleEnTerminal(id_terminal) {
    const [rows] = await db.query(
      'SELECT * FROM bicicleta WHERE estado = "disponible" AND ubicacion_actual = ? LIMIT 1',
      [id_terminal]
    );
    return rows[0];
  },

  // Actualizar estado y ubicación de la bicicleta
  async actualizarEstado(id_bicicleta, estado, ubicacion_actual = null) {
    if (ubicacion_actual !== null) {
      await db.query(
        `UPDATE bicicleta 
         SET estado = ?, ubicacion_actual = ?, fecha_ultimo_mantenimiento = NOW()
         WHERE id_bicicleta = ?`,
        [estado, ubicacion_actual, id_bicicleta]
      );
    } else {
      await db.query(
        `UPDATE bicicleta 
         SET estado = ?, fecha_ultimo_mantenimiento = NOW()
         WHERE id_bicicleta = ?`,
        [estado, id_bicicleta]
      );
    }
  },

  // Agregar nueva bicicleta
  async agregar(modelo, ubicacion_actual) {
    const [res] = await db.query(
      `INSERT INTO bicicleta (modelo, estado, ubicacion_actual, fecha_ultimo_mantenimiento)
       VALUES (?, 'disponible', ?, NOW())`,
      [modelo, ubicacion_actual]
    );
    return res.insertId;
  },

  // Contador simple de disponibles
  async disponiblesEnTerminal(id_terminal) {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS disponibles 
       FROM bicicleta 
       WHERE estado = 'disponible' AND ubicacion_actual = ?`,
      [id_terminal]
    );
    return rows[0].disponibles;
  },

  // ✅ Disponibilidad detallada para el UC-10
  async disponibilidadDetallada(id_terminal) {
    const [terminalInfo] = await db.query(
      `SELECT nombre FROM terminal WHERE id_terminal = ?`,
      [id_terminal]
    );

    const [bicis] = await db.query(
      `SELECT modelo FROM bicicleta 
       WHERE estado = 'disponible' AND ubicacion_actual = ?`,
      [id_terminal]
    );

    return {
      terminal: terminalInfo[0]?.nombre || 'Terminal desconocida',
      total: bicis.length,
      modelos: bicis.map(b => b.modelo)
    };
  }
};

module.exports = Bicicleta;
