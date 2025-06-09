import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert,
  Divider,
  Collapse
} from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Terminal {
  id_terminal: number;
  nombre: string;
  estado: string;
}

export const Devolver = () => {
  const [terminales, setTerminales] = useState<Terminal[]>([]);
  const [destino, setDestino] = useState<number | null>(null);
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarScanner, setMostrarScanner] = useState(false);
  const [alertaQR, setAlertaQR] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

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
          if (activas.length > 0) {
            setDestino(activas[0].id_terminal);
          } else {
            setError('No hay terminales activas disponibles.');
          }
        } else {
          setError('No se pudieron obtener las terminales activas.');
        }
      } catch {
        setError('Error al conectar con el servidor.');
      }
    };

    fetchTerminales();
  }, []);

  useEffect(() => {
    setMensaje('');
    setError('');
  }, [destino, codigo]);

  useEffect(() => {
    if (mostrarScanner) {
      const config = {
        fps: 10,
        qrbox: 250
      };

      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        config,
        false
      );

      scannerRef.current.render(
        (text) => {
          setCodigo(text);
          setMostrarScanner(false);
          setAlertaQR('Código escaneado correctamente.');
          setTimeout(() => setAlertaQR(''), 3000);
          scannerRef.current?.clear();
        },
        (err) => {
          console.error(err);
          setError('No se pudo acceder a la cámara.');
          setMostrarScanner(false);
        }
      );
    } else {
      scannerRef.current?.clear().catch(console.warn);
    }

    // Cleanup on unmount
    return () => {
      scannerRef.current?.clear().catch(console.warn);
    };
  }, [mostrarScanner]);

  const handleDevolver = async () => {
    if (!codigo || destino === null) {
      setError('Por favor, seleccione una terminal y escanee o ingrese el código.');
      return;
    }

    setLoading(true);
    setMensaje('');
    setError('');

    try {
      const res = await fetch('http://localhost:3351/api/prestamos/devolver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          id_terminal_destino: destino,
          codigo_desbloqueo: codigo
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.mensaje || 'Bicicleta devuelta correctamente.');
        setCodigo('');
      } else {
        setError(data.mensaje || 'No se pudo registrar la devolución.');
      }
    } catch {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4} maxWidth={400} mx="auto">
      <Typography variant="h4" textAlign="center">Devolver Bicicleta</Typography>

      <Collapse in={!!mensaje}>
        <Alert severity={mensaje.includes('penalización') ? 'warning' : 'success'}>{mensaje}</Alert>
      </Collapse>

      <Collapse in={!!error}>
        <Alert severity="error">{error}</Alert>
      </Collapse>

      <Collapse in={!!alertaQR}>
        <Alert severity="info">{alertaQR}</Alert>
      </Collapse>

      <TextField
        select
        label="Terminal de Devolución"
        value={destino ?? ''}
        onChange={e => setDestino(Number(e.target.value))}
        fullWidth
        disabled={terminales.length === 0}
      >
        {terminales.map(t => (
          <MenuItem key={t.id_terminal} value={t.id_terminal}>
            {t.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Código de desbloqueo"
        value={codigo}
        onChange={e => setCodigo(e.target.value)}
        fullWidth
        placeholder="Ingresar manualmente o usar cámara"
      />

      <Button
        variant="outlined"
        onClick={() => {
          setMostrarScanner(!mostrarScanner);
          setAlertaQR(mostrarScanner ? 'Cámara cerrada.' : 'Cámara activada para escanear QR.');
          setTimeout(() => setAlertaQR(''), 3000);
        }}
      >
        {mostrarScanner ? 'Cerrar cámara' : 'Escanear QR'}
      </Button>

      {mostrarScanner && (
        <Box mt={2}>
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </Box>
      )}

      <Divider />

      <Button
        variant="contained"
        color="primary"
        onClick={handleDevolver}
        disabled={loading || !codigo || destino === null}
      >
        {loading ? 'Procesando...' : 'Confirmar Devolución'}
      </Button>
    </Box>
  );
};
