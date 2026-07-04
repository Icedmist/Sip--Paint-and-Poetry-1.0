import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Custom plugin to redirect /admin to /admin/
const adminRedirectPlugin = () => {
  const redirectMiddleware = (req, res, next) => {
    const url = (req.originalUrl || req.url).split('?')[0];
    if (url === '/admin') {
      res.writeHead(301, { Location: '/admin/' });
      res.end();
    } else {
      next();
    }
  };
  return {
    name: 'admin-redirect',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(redirectMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirectMiddleware);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'mpa',
  plugins: [react(), adminRedirectPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
})
