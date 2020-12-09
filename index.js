import express from 'express';
import WebSocket from 'ws';
import http from 'http';
import path from 'path';

const __dirname = path.resolve();

const port = 8080;

// create app
const app = express();

// create server
const server = http.createServer(app);

// create ws server
const wss = new WebSocket.Server({ server, path: '/ws' });

// serve static files
app.use(express.static(__dirname + '/client'));

// cache ws clients
let clients = [];

wss.on('connection', ws => {

  const clientId = Math.round(Math.random() * 100);

  const newClient = {
    id: clientId,
    ws
  };

  clients.push(newClient);

  console.log(`client connected with id ${clientId}`);
  
  ws.on('message', function (msg) {
    console.log(msg);
    clients.forEach(({ ws, id }) => {
      if (id !== clientId) {
        ws.send(msg);
      }
    });
  });
  
  ws.on('close', () => {
    clients = clients.filter(({ id }) => id !== clientId);
  });

  ws.on('error', e => console.log(e));
});

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
