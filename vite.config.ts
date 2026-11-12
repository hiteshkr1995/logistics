import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from https://<user>.github.io/logistics/,
// so production builds need that sub-path as their base URL.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/logistics/' : '/',
  plugins: [react()],
  // The lazily loaded 3D map chunk (three.js) is ~570 kB minified / ~150 kB gzipped.
  build: { chunkSizeWarningLimit: 700 },
}));
