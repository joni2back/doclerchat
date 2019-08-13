const socket = require('socket.io');
const express = require('express');
const app = express();
const cors = require('./middlewares/cors');
const mongoose = require('./middlewares/mongoose');
const routes = require('./routes/routes');
const fs = require('fs');
const SocketChatService = require('./services/SocketChatService');

let server = null;

try {
    const privateKey = fs.readFileSync('/certs/priv.key');
    const certificate = fs.readFileSync('/certs/cert.pem');
    const https = require('https');
    server = https.createServer({
        key: privateKey,
        cert: certificate
    }, app);
} catch(err) {
    const http = require('http');
    server = http.createServer(app);
}

app.use(mongoose);
app.use(cors);
app.use(routes);
app.use(express.static('./public'));

server.listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log('Express listening on: %s:%s '
        .replace('%s', process.env.HOSTNAME)
        .replace('%s', process.env.PORT)
    );
});

const io = socket.listen(server);
SocketChatService(io);