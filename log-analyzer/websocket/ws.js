const WebSocket = require('ws');
const url = require('url');
const logger = require('winston');


let wss;


function attach(server) {
wss = new WebSocket.Server({ server });


wss.on('connection', (socket, req) => {
const location = url.parse(req.url, true);
logger.info('WebSocket client connected');


socket.send(JSON.stringify({ type: 'connected', ts: new Date() }));


socket.on('message', (message) => {
// extendable: incoming control messages
logger.debug('WS message from client:', message.toString());
});


socket.on('close', () => logger.info('WS client disconnected'));
});
}


function broadcast(message) {
if (!wss) return;
wss.clients.forEach(client => {
if (client.readyState === WebSocket.OPEN) {
client.send(message);
}
});
}


module.exports = { attach, broadcast };