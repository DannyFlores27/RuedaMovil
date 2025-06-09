const db = require('../config/db');

const Usuario = {
  /*crear: async (nombre, correo, hash, rol = 'usuario') => {
    const [rows] = await db.query(
      `INSERT INTO usuario (nombre, correo, contrasenia, fecha_registro, estado, rol)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [nombre, correo, hash, 'activo', rol]
    );
    return rows.insertId;
  },*/

  crear: async (nombre, correo, hash, rol = 'usuario') => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar en la tabla usuario
      const [userResult] = await connection.query(
        `INSERT INTO usuario (nombre, correo, contrasenia, fecha_registro, estado, rol)
         VALUES (?, ?, ?, NOW(), ?, ?)`,
        [nombre, correo, hash, 'activo', rol]
      );
      const id_usuario = userResult.insertId;

      // Obtener el id_rol correspondiente al nombre del rol
      let [rolResult] = await connection.query(
        `SELECT id_rol, secciones_permitidas FROM rol WHERE nombre = ?`,
        [rol]
      );

      // Si no se encuentra el rol, usar el rol por defecto 'usuario'
      if (rolResult.length === 0) {
        [rolResult] = await connection.query(
          `SELECT id_rol, secciones_permitidas FROM rol WHERE nombre = 'usuario'`
        );
        if (rolResult.length === 0) {
          throw new Error('Rol por defecto "usuario" no encontrado');
        }
      }
      const { id_rol, secciones_permitidas } = rolResult[0];

      // Insertar en la tabla usuario_rol
      await connection.query(
        `INSERT INTO usuario_rol (id_usuario, id_rol, fecha_asignacion)
         VALUES (?, ?, NOW())`,
        [id_usuario, id_rol]
      );

      await connection.commit();
      return { secciones_permitidas };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  buscarPorCorreo: async (correo) => {
    const [rows] = await db.query(
      `SELECT u.*, r.secciones_permitidas 
       FROM usuario AS u
       JOIN rol r ON u.rol = r.nombre
       WHERE u.correo = ?`,
      [correo]
    );
    return rows[0];
  },

  verificar: async (correo) => {
    await db.query(
      'UPDATE usuario SET estado = "verificado" WHERE correo = ?',
      [correo]
    );
  }
};

module.exports = Usuario;
