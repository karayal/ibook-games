import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectDirectory = dirname(fileURLToPath(import.meta.url));
export const publicDirectory = resolve(projectDirectory, 'html-preview');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.webm': 'video/webm',
};
function isInside(root, target) {
  const path = relative(root, target);
  return path === '' || (!path.startsWith(`..${sep}`) && path !== '..' && !isAbsolute(path));
}

/** Serve the existing HTML routes without changing the application stack. */
export function createStaticServer(root = publicDirectory) {
  const absoluteRoot = resolve(root);
  return createServer(async (request, response) => {
    const fail = (status, message) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : message);
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return fail(405, 'Method not allowed');
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { return fail(400, 'Invalid request path'); }
    if (pathname.includes('\0') || pathname.includes('\\')) return fail(400, 'Invalid request path');
    let target = resolve(absoluteRoot, `.${pathname}`);
    if (!isInside(absoluteRoot, target)) return fail(403, 'Forbidden');
    try {
      let info = await stat(target);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) {
          response.writeHead(308, { Location: `${pathname}/${new URL(request.url, 'http://localhost').search}` });
          return response.end();
        }
        target = resolve(target, 'index.html');
        info = await stat(target);
      }
      const canonicalRoot = await realpath(absoluteRoot);
      const canonicalTarget = await realpath(target);
      if (!isInside(canonicalRoot, canonicalTarget)) return fail(403, 'Forbidden');
      if (!info.isFile()) return fail(404, 'Page not found');
      response.writeHead(200, {
        'Content-Type': types[extname(target).toLowerCase()] || 'application/octet-stream',
        'Content-Length': info.size,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      if (request.method === 'HEAD') return response.end();
      const stream = createReadStream(target);
      stream.on('error', () => response.destroy());
      stream.pipe(response);
    } catch (error) {
      return fail(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500, 'Page not found');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
  const listenHost = process.env.IBOOK_HOST || '127.0.0.1';
  if (!['127.0.0.1', '0.0.0.0'].includes(listenHost)) throw new Error('IBOOK_HOST must be 127.0.0.1 or 0.0.0.0.');
  const server = createStaticServer();
  server.listen(port, listenHost, () => console.log(`iBOOK Games is running at http://127.0.0.1:${port}/ (listening on ${listenHost})`));
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  process.on('SIGINT', () => server.close(() => process.exit(0)));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}
