const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const quackApi = require('./db'); // Ensure this path is correct
const bcrypt = require('bcrypt'); // Only necessary if you're handling passwords

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
  console.log(`Received request for ${req.url} with method ${req.method}`);
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API endpoint logic
  if (pathname === '/quacks' && req.method === 'GET') {
    try {
      const quacks = await quackApi.getAllQuacks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(quacks));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/top-quacks' && req.method === 'GET') {
    try {
      const topQuacks = await quackApi.getTopFiveQuacks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(topQuacks));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/quacks' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const quackData = JSON.parse(body);
        const newQuack = await quackApi.addNewQuack(quackData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newQuack));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else if (pathname === '/delete-quack' && req.method === 'DELETE') {
    const quackId = parsedUrl.query.id;
    if (!quackId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Missing quackId query parameter" }));
      return;
    }
    try {
      await quackApi.deletePost(quackId);
      res.writeHead(204);
      res.end();
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    } 
  } else if (pathname === '/increment-likes' && req.method === 'POST') {
    const quackId = parsedUrl.query.id;
    if (!quackId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Missing quackId query parameter" }));
      return;
    }
    try {
      const updatedQuack = await quackApi.incrementLikes(quackId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedQuack));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        console.log(`Login attempt with email: ${email} and password: ${password}`); // Log credentials

        const user = await quackApi.loginUser(email, password);
        if (user) {
          console.log(`Login successful for user: ${email}`);
          res.writeHead(302, { 'Location': '/index.html' });
          res.end();
        } else {
          console.log(`Login failed for user: ${email}`);
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Invalid credentials" }));
        }
      } catch (error) {
        console.error('Error in /login:', error.message); // Log errors
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else if (pathname === '/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { email, password, username, id } = JSON.parse(body);
        const result = await quackApi.registerUser( email, password, username, id );
        if (result) {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: "Registration successful" }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Registration failed" }));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }
   else {
    // Static file serving logic for GET requests only
if (req.method === 'GET' && !pathname.startsWith('/api/') && !res.finished) {
  let servePath;
  
  // Serve 'login.html' for the root path
  if (pathname === '/') {
    servePath = path.join(__dirname, './screens/login.html');
  } else {
    console.log('here')
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
}
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
