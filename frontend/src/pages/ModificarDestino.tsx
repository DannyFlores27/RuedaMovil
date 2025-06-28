import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert
} from '@mui/material';

interface Terminal {
  id_terminal: number;
  nombre: string;
  estado: string;
}

export const ModificarDestino = () => {
  const [terminales, setTerminales] = useState<Terminal[]>([]);
  const [nuevoDestino, setNuevoDestino] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTerminales = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/terminales/estado`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        });

        const data = await res.json();

        if (res.ok && data.terminales) {
          const activas = data.terminales.filter((t: any) => t.estado === 'activa');
          setTerminales(activas);
          if (activas.length > 0) {
            setNuevoDestino(activas[0].id_terminal);
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
  }, [nuevoDestino]);

  const handleModificar = async () => {
    if (nuevoDestino === null) return;

    setLoading(true);
    setMensaje('');
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/prestamos/modificar-destino`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ nuevo_destino: nuevoDestino }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.mensaje || 'Destino modificado correctamente.');
      } else {
        setError(data.mensaje || 'No se pudo modificar el destino.');
      }
    } catch {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4} maxWidth={400} mx="auto">
      <Typography variant="h4" textAlign="center">Modificar Destino</Typography>

      <TextField
        select
        label="Nuevo Terminal de Destino"
        value={nuevoDestino ?? ''}
        onChange={e => setNuevoDestino(Number(e.target.value))}
        fullWidth
        disabled={terminales.length === 0}
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
        onClick={handleModificar}
        disabled={loading || nuevoDestino === null}
      >
        {loading ? 'Modificando...' : 'Confirmar Nuevo Destino'}
      </Button>

      {mensaje && <Alert severity="success">{mensaje}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};
