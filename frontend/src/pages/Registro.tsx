// src/pages/Registro.tsx
import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Stack,
  Typography,
  Snackbar,
  Alert
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Registro = () => {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success')
  const [mostrarSnackbar, setMostrarSnackbar] = useState(false)
  const navigate = useNavigate()

  const validarNombre = (nombre: string) =>
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombre.trim())

  const validarCorreo = (correo: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

  const validarPassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)

  const handleRegistro = async () => {
    setMensaje('')

    if (!validarNombre(nombre)) {
      setTipoMensaje('error')
      setMensaje('El nombre debe tener al menos 3 letras y solo contener letras o espacios.')
      return setMostrarSnackbar(true)
    }

    if (!validarCorreo(correo)) {
      setTipoMensaje('error')
      setMensaje('Correo inválido.')
      return setMostrarSnackbar(true)
    }

    if (!validarPassword(password)) {
      setTipoMensaje('error')
      setMensaje('La contraseña debe tener al menos 6 caracteres, incluir una letra y un número.')
      return setMostrarSnackbar(true)
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password, rol: 'usuario' })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.mensaje || 'Error en el registro')

      setTipoMensaje('success')
      setMensaje('Registro exitoso. Redirigiendo al login...')
      setMostrarSnackbar(true)

      setTimeout(() => navigate('/login'), 2500)

    } catch (err: any) {
      setTipoMensaje('error')
      setMensaje(err.message || 'Error desconocido')
      setMostrarSnackbar(true)
    }
  }

  return (
    <Container maxWidth="xs">
      <Stack spacing={2} mt={4}>
        <Typography variant="h4" align="center">Registrarse</Typography>

        <TextField
          label="Nombre"
          fullWidth
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <TextField
          label="Correo"
          fullWidth
          value={correo}
          onChange={e => setCorreo(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button variant="contained" onClick={handleRegistro}>
          Crear cuenta
        </Button>
        <Button variant="outlined" onClick={() => navigate('/login')}>
          Volver al login
        </Button>
      </Stack>

      <Snackbar
        open={mostrarSnackbar}
        autoHideDuration={4000}
        onClose={() => setMostrarSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMostrarSnackbar(false)}
          severity={tipoMensaje}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </Container>
  )
}
