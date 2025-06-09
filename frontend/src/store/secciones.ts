import { create } from 'zustand'
import { type Seccion } from '../types.d'
import { routeMap } from '../routes/routeMap'

interface State {
  secciones: Seccion[]
  currentSeccion: number
  fetchSecciones: (limit: number) => Promise<void>
  setSeccionesDesdeBackend: (nombres: string[]) => void
  logout: () => void
  initializeFromToken: () => Promise<boolean>
  rol?: string
  usuario?: string
}

export const useSeccionesStore = create<State>((set) => ({
  secciones: [],
  currentSeccion: 0,

fetchSecciones: async () => {
  set({
    secciones: [
      { id: 1, nombre: 'Reservar', descripcion: 'Reserva una bicicleta', imagen: '', url: '/reservar' },
      { id: 2, nombre: 'Modificar Destino', descripcion: 'Cambia el destino', imagen: '', url: '/modificar-destino' }
    ]
  });
},

setSeccionesDesdeBackend: (nombres) => {
  const nuevas = nombres.map((nombre, i) => ({
    id: i + 1,
    nombre,
    descripcion: '',
    imagen: '',
    url: routeMap[nombre] || ''
  }));
  nuevas.push({ id: 999, nombre: 'Salir', descripcion: '', imagen: '', url: '/login' });
  set({ secciones: nuevas });
},

    logout: () => {
    localStorage.removeItem('token')
    set({ secciones: [] })
    },

initializeFromToken: async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const res = await fetch('http://localhost:3351/api/auth/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Token inválido o expirado');

    const data = await res.json();
    const secciones = data.usuario.secciones_permitidas
      .split(',')
      .map((s: string) => s.trim());

    const nuevas = secciones.map((nombre: string, i: number) => ({
      id: i + 1,
      nombre,
      descripcion: '',
      imagen: '',
      url: routeMap[nombre] || ''
    }));

    nuevas.push({ id: 999, nombre: 'Salir', descripcion: '', imagen: '', url: '/login' });
    set({ secciones: nuevas });

    return true; // ✅ éxito
  } catch (error) {
    console.error('Sesión inválida:', error);
    localStorage.removeItem('token');
    set({ secciones: [] });

    return false; // ❌ error
  }
}


}))
