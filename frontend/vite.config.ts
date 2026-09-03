import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base — под GitHub Pages (проект публикуется в /skyworker-operator/)
export default defineConfig({
  plugins: [react()],
  base: '/skyworker-operator/',
})
