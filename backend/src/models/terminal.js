const db = require('../config/db');

const Terminal = {
  async espacioDisponible(id_terminal) {
    const [rows] = await db.query(
      `SELECT * FROM terminal WHERE id_terminal = ? AND espacios_disponibles > 0`,
      [id_terminal]
    );
    return rows.length > 0;
  },

  async obtener(id_terminal) {
    const [rows] = await db.query(
      'SELECT * FROM terminal WHERE id_terminal = ?',
      [id_terminal]
    );
    return rows[0];
  },

  async actualizarEspacios(id_terminal, cantidad) {
    await db.query(
      `UPDATE terminal 
       SET espacios_disponibles = espacios_disponibles + ?
       WHERE id_terminal = ?`,
      [cantidad, id_terminal]
    );
  },

  // ✅ NUEVO: agregar terminal
  async agregar(nombre, ubicacion) {
    const [res] = await db.query(
      `INSERT INTO terminal (nombre, ubicacion, espacios_disponibles, estado) 
       VALUES (?, ?, 5, 'activa')`, // 5 como espacio inicial por defecto
      [nombre, ubicacion]
    );
    return res.insertId;
  },
  

  // ✅ NUEVO: cambiar estado (activa/inactiva)
  async actualizarEstado(id_terminal, nuevo_estado) {
    await db.query(
      `UPDATE terminal SET estado = ? WHERE id_terminal = ?`,
      [nuevo_estado, id_terminal]
    );
  },
  async obtenerEstadoTerminales() {
    const [rows] = await db.query(`
      SELECT 
        t.id_terminal,
        t.nombre,
        t.ubicacion,
        t.capacidad_maxima,
        t.espacios_disponibles,
        (t.capacidad_maxima - t.espacios_disponibles) AS bicicletas_ocupando,
        t.estado
      FROM terminal t
    `);
    return rows;
  },
  //se reutiliza para activar termina UC-14
  async marcarEnMantenimiento(id_terminal) {
  await db.query(
    `UPDATE terminal 
     SET estado = 'mantenimiento'
     WHERE id_terminal = ?`,
    [id_terminal]
  );
}



};


module.exports = Terminal;
