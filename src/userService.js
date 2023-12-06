const url = require('url');
const db = require('./userDB'); // Adjust this path as needed
const bcrypt = require('bcrypt');

async function userService(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle user-related endpoints
    if (pathname === '/user/login' && req.method === 'POST') {
        let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        console.log(`Login attempt with email: ${email} and password: ${password}`); // Log credentials

        const user = await db.loginUser(email, password);
        if (user) {
          console.log(`Login successful for user: ${email}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user }));
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
    } else if (pathname === '/user/register' && req.method === 'POST') {
        let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { username, email, password, id } = JSON.parse(body);
        const result = await db.registerUser( username, email, password, id );
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
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
}

module.exports = userService;
