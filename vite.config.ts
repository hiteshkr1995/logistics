import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from https://<user>.github.io/logistics/,
// so production builds need that sub-path as their base URL.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/logistics/' : '/',
  plugins: [react()],
}));
