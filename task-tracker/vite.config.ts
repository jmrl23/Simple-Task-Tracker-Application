import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/tasks': 'http://localhost:3001',
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/tasks': 'http://localhost:3001',
    },
  },
});
