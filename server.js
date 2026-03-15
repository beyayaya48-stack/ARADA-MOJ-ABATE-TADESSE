import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  // Parse URL (to ignore query strings) and prevent path traversal
  const requestUrl = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/') {
    pathname = '/deepseek_html_20260314_ea97b6.html';
  }

  // Remove leading slash so path.join does not treat it as an absolute path on Windows
  pathname = pathname.replace(/^\//, '');

  const filePath = path.join(__dirname, pathname);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
});

server.listen(8000, () => {
  console.log('Server running at http://127.0.0.1:8000/');
});