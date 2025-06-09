const Bicicleta = require('../models/bicicleta');

exports.agregar = async (req, res) => {
  const { modelo, ubicacion_actual } = req.body;

  try {
    const id = await Bicicleta.agregar(modelo, ubicacion_actual);
    res.status(201).json({ mensaje: 'Bicicleta agregada', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar bicicleta', error });
  }
};

exports.retirar = async (req, res) => {
  const id = req.params.id;

  try {
    await Bicicleta.actualizarEstado(id, 'inactiva');
    res.status(200).json({ mensaje: 'Bicicleta retirada (inactiva)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al retirar bicicleta', error });
  }
};

exports.mandarAMantenimiento = async (req, res) => {
  const id = req.params.id;

  try {
    await Bicicleta.actualizarEstado(id, 'mantenimiento');
    res.status(200).json({ mensaje: 'Bicicleta enviada a mantenimiento' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al mandar bicicleta a mantenimiento', error });
  }
};
exports.verDisponibilidad = async (req, res) => {
  const { id_terminal } = req.params;

  try {
    const detalle = await Bicicleta.disponibilidadDetallada(id_terminal);
    res.status(200).json({
      mensaje: 'Disponibilidad consultada correctamente',
      ...detalle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar disponibilidad', error });
  }
};


