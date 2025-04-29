// server.ts
import express, { Express } from 'express';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import path from 'path';

const app: Express = express();
const PORT = 5173;

// Start LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

// Inject LiveReload script into served HTML
app.use(connectLivereload());

// Serve static files from public/
app.use(express.static('public'));

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Frontend available at http://localhost:${PORT}`);
});

// Notify LiveReload server when first connection happens
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});
