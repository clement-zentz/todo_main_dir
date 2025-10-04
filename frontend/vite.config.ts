import { defineConfig } from 'vitest/config'  // 👈 change l'import ici
import react from '@vitejs/plugin-react-swc'
import path from 'path';
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configure l'alias "@" pour pointer vers "src/"
      '@': path.resolve(__dirname, './src'), 
    },
  },
  server: {
    proxy: {
      '/api': 'http://backend:8000'
    }
  },
  test: {
    environment: 'jsdom', // 👈 ajoute cette ligne
    globals: true,
    setupFiles: './src/setupVitest.ts',
  },
});
