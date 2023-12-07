const url = require('url');
const db = require('./quackDB'); 

async function quackService(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle quack-related endpoints
    if (pathname === '/quacks/quacks' && req.method === 'GET') {
        try {
            const quacks = await db.getAllQuacks();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(quacks));
          } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
          }
    } else if (pathname === '/quacks/top-quacks' && req.method === 'GET') {
        try {
            const topQuacks = await db.getTopFiveQuacks();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(topQuacks));
          } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
          }
    } else if (pathname === '/quacks/quacks' && req.method === 'POST') {
        let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const quackData = JSON.parse(body);
        const newQuack = await db.addNewQuack(quackData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newQuack));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    } else if (pathname === '/quacks/delete-quack' && req.method === 'DELETE') {
        const quackId = parsedUrl.query.id;
    if (!quackId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Missing quackId query parameter" }));
      return;
    }
    try {
      await db.deletePost(quackId);
      res.writeHead(204);
      res.end();
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    } 
    } else if (pathname === '/quacks/increment-likes' && req.method === 'POST') {
        const quackId = parsedUrl.query.id;
    if (!quackId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Missing quackId query parameter" }));
      return;
    }
    try {
      const updatedQuack = await db.incrementLikes(quackId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedQuack));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
    } else if (pathname === '/quacks/add-comment' && req.method === 'POST') {
        let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { quackId, comment } = JSON.parse(body);
        const result = await db.addComment(quackId, comment);
        if (result) {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: "comment added successfully" }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "adding failed" }));
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

module.exports = quackService;
