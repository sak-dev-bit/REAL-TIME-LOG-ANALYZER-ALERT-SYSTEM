const nodemailer = require('nodemailer');
const config = require('config');


const conf = config.get('alerts.email');


async function sendAlert(parsed, keywords) {
if (!conf.enabled) return;


const transporter = nodemailer.createTransport(conf.smtp);
const subject = `ALERT: keywords [${keywords.join(', ')}] detected`;
const body = `Time: ${parsed.timestamp}\nLevel: ${parsed.level}\nMessage: ${parsed.message}\nSource: ${parsed.source}\n`;


return transporter.sendMail({
from: conf.from,
to: conf.smtp.auth.user, // you can set a list or separate config
subject,
text: body
});
}


module.exports = { sendAlert };