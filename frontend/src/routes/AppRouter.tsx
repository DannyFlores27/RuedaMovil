// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Registro } from '../pages/Registro'
import App from '../App'
import { PrivateRoute } from './PrivateRoute'

import { Inicio } from '../pages/Inicio'

// Páginas por sección
import { Reservar } from '../pages/Reservar'
import { ModificarDestino } from '../pages/ModificarDestino'
import { Disponibilidad } from '../pages/Disponibilidad'
import { Devolver } from '../pages/Devolver'
import { Reportar } from '../pages/Reportar'
import { MisPrestamos } from '../pages/MisPrestamos'
import { Reporte } from '../pages/Reporte'
import { GestionarBicicletas } from '../pages/GestionarBicicletas'
import { GestionarTerminales } from '../pages/GestionarTerminales'
import { GestionarUsuarios } from '../pages/GestionarUsuarios'
import { EstadoBicicletas } from '../pages/EstadoBicicletas'
import { Mantenimiento } from '../pages/Mantenimiento'
import { AtenderConsultas } from '../pages/AtenderConsultas'
import { DesbloquearBicicletas } from '../pages/DesbloquearBicicletas'
import { GestionarReclamos } from '../pages/GestionarReclamos'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<PrivateRoute><App /></PrivateRoute>}>
          <Route index element={<Inicio />} />
          <Route path="reservar" element={<Reservar />} />
          <Route path="modificar-destino" element={<ModificarDestino />} />
          <Route path="disponibilidad" element={<Disponibilidad />} />
          <Route path="devolver" element={<Devolver />} />
          <Route path="reportar" element={<Reportar />} />
          <Route path="mis-prestamos" element={<MisPrestamos />} />
          <Route path="reporte" element={<Reporte />} />
          <Route path="bicicletas" element={<GestionarBicicletas />} />
          <Route path="terminales" element={<GestionarTerminales />} />
          <Route path="usuarios" element={<GestionarUsuarios />} />
          <Route path="estado-bicicletas" element={<EstadoBicicletas />} />
          <Route path="mantenimiento" element={<Mantenimiento />} />
          <Route path="consultas" element={<AtenderConsultas />} />
          <Route path="desbloqueo" element={<DesbloquearBicicletas />} />
          <Route path="reclamos" element={<GestionarReclamos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
