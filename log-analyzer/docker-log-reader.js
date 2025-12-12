

const net = require('net');
const readline = require('readline');
const logger = require('winston');


const PORT = 4000; // generator will connect here


function start(onLine) {
const server = net.createServer((socket) => {
logger.info('Log generator connected');
const rl = readline.createInterface({ input: socket });
rl.on('line', (line) => {
if (line && line.trim()) onLine(line);
});
socket.on('close', () => logger.info('Generator disconnected'));
socket.on('error', (err) => logger.error('Socket error', err));
});


server.listen(PORT, () => logger.info(`Docker log reader listening on ${PORT}`));
}


module.exports = { start };