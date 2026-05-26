import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api_login': {
          target: env.VITE_API_URL_LOGIN ?? 'http://localhost:9010/api/v2',
          changeOrigin: true,
          secure: false,
          rewrite: (routePath) => routePath.replace(/^\/api_login/, ''),
        },
        '/api_data': {
          target: env.VITE_API_URL ?? 'http://localhost:4020',
          changeOrigin: true,
          secure: false,
          rewrite: (routePath) => routePath.replace(/^\/api_data/, ''),
        },
      },
    },
  }
})
