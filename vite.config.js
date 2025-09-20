import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    host: '0.0.0.0'
  },
  resolve: { 
    alias: {
      components: path.resolve(__dirname, "src/components"),
      features: path.resolve(__dirname, "src/features"),
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
})
