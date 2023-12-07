const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const quackService = require('./quackService');
const userService = require('./userService');

const port = process.env.PORT || 3000;

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    // Add other mime types as needed
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Route API requests to the appropriate service
    if (pathname.startsWith('/quacks')) {
        quackService(req, res);
    } else if (pathname.startsWith('/user')) {
        userService(req, res);
    } else if (req.method === 'GET' && !pathname.startsWith('/api/') && !res.finished) {
        let servePath;

        // Serve 'login.html' for the root path
        if (pathname === '/') {
            servePath = path.join(__dirname, './screens/login.html');
        } else {
            // Serve other static files from the 'src' directory
            servePath = path.join(__dirname, '', pathname);
        }

        fs.stat(servePath, (err, stats) => {
            if (err) {
                console.log(`File not found: ${servePath}`);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`File not found: ${pathname}`);
                return;
            }

            if (stats.isDirectory()) {
                // If a directory is requested, serve 'index.html' from that directory
                servePath = path.join(servePath, './screens/index.html');
            }

            fs.readFile(servePath, (readErr, data) => {
                if (readErr) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Server error: ${readErr.message}`);
                } else {
                    // Determine the content type based on the file extension
                    const ext = path.parse(servePath).ext;
                    res.writeHead(200, { 'Content-Type': mimeType[ext] || 'text/plain' });
                    res.end(data);
                }
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
