// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import proxy from 'vite-plugin-proxy';

// Define your proxy configuration
const proxyConfig = {
  '/api': {
    target: 'https://api.sportmonks.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

// https://vitejs.dev/config/

export default {
  plugins: [
    // ...
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://example.com',
        changeOrigin: true,
        // Add some debugging
        onProxyReq(proxyReq) {
          console.log('Proxy request sent:', proxyReq.method, proxyReq.path);
        },
      },
    },
  },
};
