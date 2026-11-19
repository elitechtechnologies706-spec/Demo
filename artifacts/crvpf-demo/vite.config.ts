import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const basePath = process.env.BASE_PATH || '/';
const host = process.env.HOST || '0.0.0.0';
const nodeEnv = process.env.NODE_ENV || 'production';
const replId = process.env.REPL_ID || '';

const pageEntries = {
  index: 'index.html',
  about: 'about.html',
  programmes: 'programmes.html',
  pvac: 'pvac.html',
  agpp: 'agpp.html',
  eydcd: 'eydcd.html',
  coordinated: 'coordinated.html',
  joint: 'joint.html',
  impact: 'impact.html',
  whereWeWork: 'where-we-work.html',
  resources: 'resources.html',
  getInvolved: 'get-involved.html',
  contact: 'contact.html',
  publications: 'publications.html',
  inception: 'inception.html',
  audit: 'audit.html',
  analytics: 'analytics.html',
  hosting: 'hosting.html',
  training: 'training.html',
  handover: 'handover.html',
  support: 'support.html',
};

export default defineConfig(async ({ command }) => {
  const port =
    command === 'serve' ? Number(process.env.PORT) || 5173 : 5173;

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),
      ...(nodeEnv !== 'production' && replId
        ? [
            await import('@replit/vite-plugin-cartographer').then((m) =>
              m.cartographer({
                root: path.resolve(import.meta.dirname, '..'),
              }),
            ),
            await import('@replit/vite-plugin-dev-banner').then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
      rollupOptions: {
        input: Object.fromEntries(
          Object.entries(pageEntries).map(([name, file]) => [
            name,
            path.resolve(import.meta.dirname, file),
          ]),
        ),
      },
    },
    server: {
      port,
      strictPort: true,
      host,
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host,
      allowedHosts: true,
    },
  };
});
