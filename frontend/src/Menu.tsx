// src/Menu.tsx
import { Button, Stack, Box } from '@mui/material'
import { useSeccionesStore } from './store/secciones'
import { useNavigate } from 'react-router-dom'
import { routeMap } from './routes/routeMap'

export const Menu = () => {
  const secciones = useSeccionesStore(state => state.secciones)
  const logout = useSeccionesStore(state => state.logout)
  const navigate = useNavigate()

  const handleClick = (nombre: string) => {
    if (nombre === 'Salir') {
      logout()
      navigate('/login')
    } else if (routeMap[nombre]) {
      navigate(routeMap[nombre])
    } else {
      console.warn(`Ruta no encontrada para: ${nombre}`)
    }
  }

  return (
    <Box width="100%" maxWidth={400} px={2}>
      <Stack spacing={1} mt={2}>
        {secciones.map((sec, i) => (
          <Button
            key={i}
            variant="contained"
            fullWidth
            color={sec.nombre === 'Salir' ? 'error' : 'primary'}
            onClick={() => handleClick(sec.nombre)}
          >
            {sec.nombre}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}
