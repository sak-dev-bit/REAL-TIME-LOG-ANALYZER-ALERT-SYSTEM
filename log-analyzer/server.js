const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const config = require('config');
const path = require('path');
const logger = require('winston');


const wsServer = require('./websocket/ws');
const dockerLogReader = require('./docker-log-reader');


const app = express();
app.use(bodyParser.json());


// health route
app.use('/health', require('./routes/health'));


// static route for demonstration (not necessary if frontend served by nginx)
app.get('/', (req, res) => res.send('Log Analyzer running'));


const server = http.createServer(app);


// websocket setup (attaches to http server)
wsServer.attach(server);


const PORT = process.env.PORT || config.get('server.port') || 3000;
server.listen(PORT, () => {
logger.info(`Log Analyzer listening on ${PORT}`);
// start docker log reader (in our example it listens to a simple file/socket generator)
dockerLogReader.start((entry) => {
// parse the entry
const parsed = require('./utils/parser').parse(entry);
// broadcast to websocket clients
wsServer.broadcast(JSON.stringify({ type: 'log', data: parsed }));
// analyze for keywords
const alerts = require('./utils/parser').detectKeywords(parsed.message);
if (alerts.length) {
logger.warn(`Keywords detected: ${alerts.join(',')}`);
// send alerts (email & sms) -- these modules check config.enabled flags
require('./alerts/email').sendAlert(parsed, alerts).catch(err => logger.error(err));
require('./alerts/sms').sendAlert(parsed, alerts).catch(err => logger.error(err));
}
});
});


// graceful shutdown
process.on('SIGINT', () => {
logger.info('Shutting down...');
server.close(() => process.exit(0));
});