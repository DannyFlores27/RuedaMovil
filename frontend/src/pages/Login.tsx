import { useEffect, useState } from 'react'
import { Container, TextField, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSeccionesStore } from '../store/secciones'

export const Login = () => {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setSeccionesDesdeBackend = useSeccionesStore(state => state.setSeccionesDesdeBackend)
  const initializeFromToken = useSeccionesStore(state => state.initializeFromToken)

  const handleLogin = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, password })
    })

    if (!res.ok) throw new Error('Credenciales incorrectas')

    const data = await res.json()

    localStorage.setItem('token', data.token)

    const nombres = data.usuario.secciones_permitidas
      .split(',')
      .map((s: string) => s.trim())

    setSeccionesDesdeBackend(nombres)

    navigate('/')
  } catch (err) {
    console.error('Error al iniciar sesión:', err)
    alert('Usuario o contraseña incorrectos')
  }
}


  // Autologin si hay token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      initializeFromToken().then(() => {
        navigate('/')
      })
    }
  }, [])

  return (
    <Container maxWidth="xs">
      <Stack spacing={2} mt={4}>
        <Typography variant="h4" align="center">Iniciar Sesión</Typography>

        <TextField label="Correo" fullWidth value={correo} onChange={e => setCorreo(e.target.value)} />
        <TextField label="Contraseña" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />

        <Button variant="contained" onClick={handleLogin}>Iniciar Sesión</Button>
        <Button variant="outlined" onClick={() => navigate('/registro')}>Registrarse</Button>
      </Stack>
    </Container>
  )
}
