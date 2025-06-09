import { create } from 'zustand'
import { type Seccion } from '../types'

interface State {
  secciones: Seccion[]
  currentSeccion: number
  fetchSecciones: (limit: number) => Promise<void>
  setSeccionesDesdeBackend: (nombres: string[]) => void
  logout: () => void
  initializeFromToken: () => Promise<void>
  rol?: string
  usuario?: string
}

export const useSeccionesStore = create<State>((set) => ({
  secciones: [],
  currentSeccion: 0,

  fetchSecciones: async (limit) => {
    set({
      secciones: [
        { id: 1, nombre: 'Reservar', descripcion: 'Reserva una bicicleta', imagen: '' },
        { id: 2, nombre: 'Modificar Destino', descripcion: 'Cambia el destino', imagen: '' }
      ]
    })
  },

  setSeccionesDesdeBackend: (nombres) => {
    const nuevas = nombres.map((nombre, i) => ({
        id: i + 1,
        nombre,
        descripcion: '',
        imagen: ''
    }))
    set({ secciones: [...nuevas, { id: 999, nombre: 'Salir', descripcion: '', imagen: '' }] })
    },

    logout: () => {
    localStorage.removeItem('token')
    set({ secciones: [] })
    },

  initializeFromToken: async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await fetch('http://localhost:3351/api/auth/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) throw new Error('Token inválido o expirado')

    const data = await res.json()
    const secciones = data.usuario.secciones_permitidas
      .split(',')
      .map((s: string) => s.trim())

    const nuevas = secciones.map((nombre: string, i: number) => ({
      id: i + 1,
      nombre,
      descripcion: '',
      imagen: ''
    }))

    nuevas.push({ id: 999, nombre: 'Salir', descripcion: '', imagen: '' })
    set({ secciones: nuevas })
  } catch (error) {
    console.error('Sesión inválida:', error)
    localStorage.removeItem('token')
    set({ secciones: [] })
  }
}

}))
