const Terminal = require('../models/terminal');

// ✅ Agregar nueva terminal
exports.agregar = async (req, res) => {
  const { nombre, ubicacion } = req.body;
  try {
    const id = await Terminal.agregar(nombre, ubicacion);
    res.status(201).json({ mensaje: 'Terminal agregada', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar terminal', error });
  }
};

// ✅ Cambiar estado de terminal
exports.cambiarEstado = async (req, res) => {
  const id_terminal = req.params.id;
  const { estado } = req.body; // activa o inactiva

  try {
    await Terminal.actualizarEstado(id_terminal, estado);
    res.status(200).json({ mensaje: `Terminal ${estado}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar estado de terminal', error });
  }
};

// ✅ UC-12: Estado general de terminales
exports.estadoTerminales = async (req, res) => {
  try {
    const terminales = await Terminal.obtenerEstadoTerminales();
    res.status(200).json({ terminales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener estado de terminales', error });
  }
};
//se reutiliza para activar termina UC-14
exports.asignarMantenimiento = async (req, res) => {
  const id_terminal = req.params.id;

  try {
    await Terminal.marcarEnMantenimiento(id_terminal);
    res.status(200).json({ mensaje: 'Terminal marcada como en mantenimiento' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al asignar mantenimiento', error });
  }
};

