import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Divider,
  TextField,
  MenuItem,
  Pagination,
  Button,
  Stack
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';  // Import correcto para SVG QR

interface Prestamo {
  id_prestamo: number;
  id_bicicleta: number;
  terminal_origen: string;
  terminal_destino: string;
  id_terminal_destino_modificado: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  codigo_desbloqueo: string;
  estado_modificacion: string;
  modelo: string;
}

const estados = ['todos', 'activo', 'finalizado'] as const; // Tipo literal para mejor seguridad

const prestamosPorPagina = 10;

export const MisPrestamos = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [filtro, setFiltro] = useState<typeof estados[number]>('todos');
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch('http://localhost:3351/api/prestamos/historial', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        });

        const data = await res.json();

        if (res.ok && data.historial) {
          // Ordenar primero activos y luego finalizados para tener consistencia
          const activos = data.historial.filter((p: Prestamo) => p.estado === 'activo');
          const finalizados = data.historial.filter((p: Prestamo) => p.estado === 'finalizado');
          setPrestamos([...activos, ...finalizados]);
        } else {
          setError('No se pudo obtener el historial de préstamos.');
        }
      } catch {
        setError('Error al conectar con el servidor.');
      }
    };

    fetchHistorial();
  }, []);

  // Filtrar préstamos según estado
  const prestamosFiltrados = prestamos.filter(p =>
    filtro === 'todos' ? true : p.estado === filtro
  );

  const totalPaginas = Math.ceil(prestamosFiltrados.length / prestamosPorPagina);

  // Paginación simple
  const prestamosPaginados = prestamosFiltrados.slice(
    (pagina - 1) * prestamosPorPagina,
    pagina * prestamosPorPagina
  );

  // Exportar CSV
  const exportarCSV = () => {
    const filas = [
      ['ID', 'Bicicleta', 'Modelo', 'Origen', 'Destino', 'Inicio', 'Fin', 'Estado', 'Código']
    ];

    prestamosFiltrados.forEach(p => {
      filas.push([
        p.id_prestamo.toString(),
        p.id_bicicleta.toString(),
        p.modelo,
        p.terminal_origen,
        p.terminal_destino,
        new Date(p.fecha_inicio).toLocaleString(),
        p.fecha_fin ? new Date(p.fecha_fin).toLocaleString() : '',
        p.estado,
        p.codigo_desbloqueo
      ]);
    });

    const csvContent = filas.map(f => f.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mis_prestamos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4} maxWidth={700} mx="auto">
      <Typography variant="h4" textAlign="center">Mis Préstamos</Typography>

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <TextField
          select
          label="Filtrar por estado"
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value as typeof estados[number]);
            setPagina(1);
          }}
          size="small"
        >
          {estados.map(est => (
            <MenuItem key={est} value={est}>
              {est.charAt(0).toUpperCase() + est.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setFiltro('todos')}>
            Limpiar Filtros
          </Button>
          <Button variant="contained" onClick={exportarCSV}>
            Exportar CSV
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {prestamosFiltrados.length === 0 && !error && (
        <Typography textAlign="center">No se encontraron préstamos.</Typography>
      )}

      {prestamosPaginados.map((p) => (
        <Card
          key={p.id_prestamo}
          variant="outlined"
          sx={{ bgcolor: p.estado === 'activo' ? '#e3f2fd' : 'inherit' }}
        >
          <CardContent>
            <Typography variant="h6">
              {p.estado === 'activo' ? 'Préstamo Activo' : `Préstamo Finalizado #${p.id_prestamo}`}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><strong>Modelo:</strong> {p.modelo}</Typography>
            <Typography><strong>Bicicleta ID:</strong> {p.id_bicicleta}</Typography>
            <Typography><strong>Origen:</strong> {p.terminal_origen}</Typography>
            <Typography><strong>Destino:</strong> {p.terminal_destino}</Typography>
            {p.estado_modificacion === 'sí' && (
              <Typography color="warning.main"><strong>Destino Modificado</strong></Typography>
            )}
            <Typography><strong>Inicio:</strong> {new Date(p.fecha_inicio).toLocaleString()}</Typography>
            <Typography>
              <strong>Fin:</strong> {p.fecha_fin ? new Date(p.fecha_fin).toLocaleString() : '—'}
            </Typography>
            <Typography><strong>Código de desbloqueo:</strong> {p.codigo_desbloqueo}</Typography>

            <Box mt={2} textAlign="center">
              <QRCodeSVG value={p.codigo_desbloqueo} size={100} />
            </Box>
          </CardContent>
        </Card>
      ))}

      {totalPaginas > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={(_, value) => setPagina(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
