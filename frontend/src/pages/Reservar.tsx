import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

interface Terminal {
  id_terminal: number;
  nombre: string;
  estado: string;
}

export const Reservar = () => {
  const [terminales, setTerminales] = useState<Terminal[]>([]);
  const [origen, setOrigen] = useState<number | null>(null);
  const [destino, setDestino] = useState<number | null>(null);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener terminales disponibles
  useEffect(() => {
    const fetchTerminales = async () => {
      try {
        const res = await fetch('http://localhost:3351/api/terminales/estado', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        });

        const data = await res.json();

        if (res.ok && data.terminales) {
          const activas = data.terminales.filter((t: any) => t.estado === 'A');
          setTerminales(activas);
          if (activas.length >= 2) {
            setOrigen(activas[0].id_terminal);
            setDestino(activas[1].id_terminal);
          }
        } else {
          setError('No se pudieron obtener las terminales.');
        }
      } catch {
        setError('Error al conectar con el servidor.');
      }
    };

    fetchTerminales();
  }, []);

  // Limpiar mensajes al cambiar selección
  useEffect(() => {
    setMensaje('');
    setError('');
  }, [origen, destino]);

  const handleReserva = async () => {
    if (origen === null || destino === null) return;

    setLoading(true);
    setMensaje('');
    setError('');
    try {
      const res = await fetch('http://localhost:3351/api/prestamos/reservar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          id_terminal_origen: origen,
          id_terminal_destino: destino
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCodigo(data.codigo_desbloqueo);
        setMensaje(data.mensaje || 'Reserva confirmada.');
      } else {
        setCodigo(null);
        setError(data.mensaje || 'Error al realizar la reserva.');
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const descargarQR = () => {
    const qrWrapper = document.getElementById('qr-wrapper');
    if (!qrWrapper) return;

    toPng(qrWrapper)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `ruedamovil_qr_${codigo}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {
        alert('Error al generar la imagen del código QR');
      });
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4} maxWidth={400} mx="auto">
      <Typography variant="h4" textAlign="center">Reservar Bicicleta</Typography>

      <TextField
        select
        label="Terminal de Origen"
        value={origen ?? ''}
        onChange={e => setOrigen(Number(e.target.value))}
        fullWidth
        disabled={terminales.length < 2}
      >
        {terminales.map(t => (
          <MenuItem key={t.id_terminal} value={t.id_terminal}>
            {t.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Terminal de Destino"
        value={destino ?? ''}
        onChange={e => setDestino(Number(e.target.value))}
        fullWidth
        disabled={terminales.length < 2}
      >
        {terminales.map(t => (
          <MenuItem key={t.id_terminal} value={t.id_terminal}>
            {t.nombre}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={handleReserva}
        disabled={loading || origen === destino || !!codigo || origen === null || destino === null}
      >
        {loading ? 'Reservando...' : 'Confirmar Reserva'}
      </Button>

      {mensaje && <Alert severity="success">{mensaje}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {codigo && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">Código de Desbloqueo:</Typography>
          <Typography variant="h4" color="primary" gutterBottom>{codigo}</Typography>
          <Box id="qr-wrapper" style={{ display: 'inline-block', background: 'white', padding: '16px', borderRadius: '8px' }}>
            <QRCode value={codigo} size={200} />
          </Box>
          <Box mt={2}>
            <Button variant="outlined" onClick={descargarQR}>
              Descargar Código QR
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
