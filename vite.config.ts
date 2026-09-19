import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024; // 5 MB max image payload

function savePhotoPlugin(): Plugin {
  return {
    name: 'save-photo-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-photo', (req, res, next) => {
        // Set standard security headers on API responses
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        if (req.method === 'POST') {
          let rawData = '';
          let receivedBytes = 0;
          let aborted = false;

          req.on('data', (chunk) => {
            if (aborted) return;
            receivedBytes += chunk.length;
            if (receivedBytes > MAX_PAYLOAD_BYTES) {
              aborted = true;
              res.statusCode = 413;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Payload exceeds maximum limit (5MB)' }));
              req.destroy();
              return;
            }
            rawData += chunk;
          });

          req.on('end', () => {
            if (aborted) return;
            try {
              const body = JSON.parse(rawData);
              const dataUrl = body?.dataUrl || body?.image;
              if (!dataUrl || typeof dataUrl !== 'string') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing image data' }));
                return;
              }

              const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');

              // Magic Byte Validation: Ensure valid image binary headers
              const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
              const isPng = buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
              const isWebp = buffer.length > 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';

              if (!isJpeg && !isPng && !isWebp) {
                res.statusCode = 415;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid image format. Only JPEG, PNG, or WebP allowed.' }));
                return;
              }

              // Strict target destination paths (path-traversal safe)
              const publicTarget = path.resolve(process.cwd(), 'public/DSC04070.jpg');
              fs.writeFileSync(publicTarget, buffer);

              const distDir = path.resolve(process.cwd(), 'dist');
              if (fs.existsSync(distDir)) {
                fs.writeFileSync(path.resolve(distDir, 'DSC04070.jpg'), buffer);
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Image successfully validated and saved permanently to server.',
                path: '/DSC04070.jpg',
              }));
            } catch {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal processing error' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  const rootDir = import.meta.dirname || process.cwd();

  return {
    plugins: [react(), tailwindcss(), savePhotoPlugin()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
