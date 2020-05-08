const fs = require('fs');
const CryptoJS = require("crypto-js");
const http = require('http');
const Websocket = require('ws');
const index = fs.readFileSync('./client/index.html', 'utf8');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(index);
});
const wss = new Websocket.Server({
  server
});
wss.on('connection', ws => {
  ws.on('message', message => {
    if (message === 'exit') {
      ws.close();
    } else {
      wss.clients.forEach(client => {
        if (client.readyState === Websocket.OPEN) {
          const messageEncrypt = CryptoJS.AES.encrypt(message, 'TEST').toString();
          client.send(messageEncrypt);
        }
      });
    }
  });
  const messageEncrypt = CryptoJS.AES.encrypt('Welcome message!', 'TEST').toString();
  ws.send(messageEncrypt);
});
server.listen(3001, () => {
  console.log('Listen port 3001');
});
