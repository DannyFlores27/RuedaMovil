const Bicicleta = require('../models/bicicleta');
const Prestamo = require('../models/prestamo');
const Terminal = require('../models/terminal');
const crypto = require('crypto');

// 🚲 UC-2: Reservar bicicleta
exports.reservar = async (req, res) => {
  const { id_terminal_origen, id_terminal_destino } = req.body;
  const id_usuario = req.usuario.id;

  try {
    // Validación básica
    if (!id_terminal_origen || !id_terminal_destino) {
      return res.status(400).json({
        mensaje: 'Debes seleccionar terminal de origen y destino'
      });
    }

    if (id_terminal_origen === id_terminal_destino) {
      return res.status(400).json({
        mensaje: 'La terminal de origen y destino no pueden ser iguales'
      });
    }

    // Verificar si el usuario ya tiene un préstamo activo
    const prestamoActivo = await Prestamo.obtenerPrestamoActivo(id_usuario);
    if (prestamoActivo) {
      return res.status(400).json({
        mensaje: 'Ya tienes una bicicleta reservada o en uso. Finalízala antes de reservar otra.'
      });
    }

    // Verificar disponibilidad de bicicletas en la terminal de origen
    const bicicleta = await Bicicleta.obtenerDisponibleEnTerminal(id_terminal_origen);
    if (!bicicleta) {
      return res.status(404).json({
        mensaje: 'No hay bicicletas disponibles en la terminal de origen seleccionada.'
      });
    }

    // Generar código de desbloqueo
    const codigo = crypto.randomBytes(4).toString('hex');

    // Crear el préstamo
    const id_prestamo = await Prestamo.crear({
      id_usuario,
      id_bicicleta: bicicleta.id_bicicleta,
      id_terminal_origen,
      id_terminal_destino,
      codigo
    });

    // Marcar la bicicleta como "en uso"
    await Bicicleta.actualizarEstado(bicicleta.id_bicicleta, 'en uso');

    return res.status(201).json({
      mensaje: '✅ Reserva confirmada. Puedes usar el código para desbloquear tu bicicleta.',
      id_prestamo,
      codigo_desbloqueo: codigo
    });
  } catch (error) {
    console.error('[Reserva Error]', error);
    return res.status(500).json({
      mensaje: '❌ Ocurrió un error al procesar tu reserva. Intenta nuevamente más tarde.'
    });
  }
};

// 🔄 UC-3: Modificar destino durante el viaje
exports.modificarDestino = async (req, res) => {
  const id_usuario = req.usuario.id;
  const { nuevo_destino } = req.body;

  try {
    const prestamo = await Prestamo.obtenerPrestamoActivo(id_usuario);

    if (!prestamo) {
      return res.status(404).json({ mensaje: 'No hay un préstamo activo' });
    }

    const disponible = await Terminal.espacioDisponible(nuevo_destino);
    if (!disponible) {
      return res.status(400).json({ mensaje: 'La terminal no tiene espacio disponible' });
    }

    await Prestamo.modificarDestino(prestamo.id_prestamo, nuevo_destino);

    res.status(200).json({ mensaje: 'Destino modificado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al modificar destino', error });
  }
};

// 🔄 devolver bicicleta UC-5
exports.devolver = async (req, res) => {
  const { id_terminal_destino, codigo_desbloqueo } = req.body;

  try {
    const prestamo = await Prestamo.obtenerPrestamoActivoCodigo(codigo_desbloqueo);

    if (!prestamo) {
      return res.status(404).json({
        mensaje: 'No se encontró un préstamo activo con ese código. Verifica que el código sea correcto.',
      });
    }

    const terminal = await Terminal.obtener(id_terminal_destino);

    if (!terminal || terminal.espacios_disponibles <= 0) {
      return res.status(400).json({
        mensaje: `La terminal "${terminal?.nombre || 'seleccionada'}" no tiene espacios disponibles para devolver bicicletas en este momento.`,
      });
    }

    const fecha_fin = new Date();
    const fecha_inicio = new Date(prestamo.fecha_inicio);
    const minutosUsados = Math.floor((fecha_fin - fecha_inicio) / 60000);

    await Prestamo.finalizar(prestamo.id_prestamo, id_terminal_destino, fecha_fin);
    await Bicicleta.actualizarEstado(prestamo.id_bicicleta, 'disponible', id_terminal_destino);
    await Terminal.actualizarEspacios(id_terminal_destino, -1); // ocupamos 1 espacio

    let mensaje = `✅ Bicicleta devuelta correctamente en la terminal "${terminal.nombre}".`;
    if (minutosUsados > 60) {
      await Prestamo.aplicarPenalizacion(prestamo.id_usuario); // opcional
      mensaje += ` Tiempo de uso: ${minutosUsados} minutos (⚠️ se aplicó una penalización por exceder 60 minutos).`;
    } else {
      mensaje += ` Tiempo total de uso: ${minutosUsados} minutos. ¡Gracias por usar RuedaMovil!`;
    }

    res.status(200).json({ mensaje });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: '❌ Ocurrió un error al procesar la devolución. Intenta nuevamente más tarde.',
      error: error.message,
    });
  }
};

// 📜 UC-6: Ver historial de préstamos
exports.verHistorial = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const historial = await Prestamo.obtenerHistorialPorUsuario(id_usuario);
    res.status(200).json({ historial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener historial', error });
  }
};

