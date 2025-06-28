import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (`development` o `production`)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    define: {
      __API__: JSON.stringify(env.VITE_API_URL || '/api'),
    },
    server: {
      port: 5173,
      open: true,
    },
  }
})

