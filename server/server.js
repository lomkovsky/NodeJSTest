require('dotenv').config()
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
          const messageEncrypt = CryptoJS.AES.encrypt(message, process.env.SECRET).toString();
          client.send(messageEncrypt);
        }
      });
    }
  });
  const messageEncrypt = CryptoJS.AES.encrypt('Welcome message!', process.env.SECRET).toString();
  ws.send(messageEncrypt);
});
server.listen(process.env.PORT, () => {
  console.log(`Listen port ${process.env.PORT}`);
});
