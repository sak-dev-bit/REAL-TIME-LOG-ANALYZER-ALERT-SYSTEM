const Twilio = require('twilio');
const config = require('config');


const conf = config.get('alerts.sms');


async function sendAlert(parsed, keywords) {
if (!conf.enabled) return;
const client = new Twilio(conf.accountSid, conf.authToken);
const body = `ALERT ${keywords.join(', ')} | ${parsed.level} | ${parsed.message}`;
return client.messages.create({
from: conf.from,
to: conf.to,
body
});
}


module.exports = { sendAlert };