// src/App.tsx
import './App.css'
import { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { useSeccionesStore } from './store/secciones'
import { useNavigate, Outlet } from 'react-router-dom'
import { BiciLogo } from './BiciLogo'
import { routeMap } from './routes/routeMap'

const darkTheme = createTheme({ palette: { mode: 'dark' } })

export default function App() {
  const [open, setOpen] = useState(false)
  const secciones = useSeccionesStore((state) => state.secciones)
  const initializeFromToken = useSeccionesStore((state) => state.initializeFromToken)
  const logout = useSeccionesStore((state) => state.logout)
  const navigate = useNavigate()
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    } else if (secciones.length === 0) {
      initializeFromToken().then(success => {
        if (!success) navigate('/login')
      })
    }
  }, [navigate, secciones.length, initializeFromToken])

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen)

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

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box display="flex" alignItems="center" p={2} gap={1}>
        <BiciLogo />
        <Typography
          variant="h6"
          noWrap
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          RuedaMovil
        </Typography>
      </Box>
      <Divider />
      <List>
        {secciones.map((sec, index) => (
          <ListItem key={sec.nombre} disablePadding>
            <ListItemButton onClick={() => handleClick(sec.nombre)}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={sec.nombre} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              RuedaMovil
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer open={open} onClose={toggleDrawer(false)}>
          {drawerList}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  )
}
