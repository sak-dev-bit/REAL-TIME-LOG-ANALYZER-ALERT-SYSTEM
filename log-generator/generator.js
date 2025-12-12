// Simple TCP log generator which connects to log-analyzer:4000 and emits random logs.
const net = require('net');


const HOST = process.env.LOG_RECEIVER_HOST || 'log-analyzer';
const PORT = process.env.LOG_RECEIVER_PORT || 4000;
const RATE = parseInt(process.env.LOG_RATE || '700', 10); // ms between messages


const client = new net.Socket();


function randomItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }


const levels = ['INFO','WARN','ERROR','DEBUG'];
const services = ['auth-service','payment-service','db','cache','api-gateway'];
const messages = [
'User logged in successfully',
'Failed to authenticate user',
'Database connection timeout',
'Cache miss for key user:123',
'Payment processed',
'Unhandled exception on request',
'Timeout while calling downstream service',
'Unauthorized access attempt detected',
'Critical disk usage exceeded',
'Background job completed'
];


function buildLine() {
const ts = new Date().toISOString();
const level = randomItem(levels);
const src = randomItem(services);
const msg = randomItem(messages);
return `${ts} ${level} ${src} ${msg}`;
}


function connectAndSend() {
client.connect(PORT, HOST, () => {
console.log('Connected to log receiver');
setInterval(() => {
const line = buildLine();
client.write(line + '\n');
}, RATE);
});


client.on('error', (err) => {
console.error('Connection error', err.message);
setTimeout(connectAndSend, 2000);
});


client.on('close', () => {
console.log('Connection closed, retrying');
setTimeout(connectAndSend, 2000);
});
}


connectAndSend();