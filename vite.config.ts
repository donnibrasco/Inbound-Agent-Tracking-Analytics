import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    origin: 'https://calleraiagent.my',
    hmr: {
      host: 'calleraiagent.my',
      protocol: 'wss',
      port: 443,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});