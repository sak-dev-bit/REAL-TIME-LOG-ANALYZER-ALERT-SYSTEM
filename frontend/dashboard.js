(function(){
const url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.hostname + ':3000';
const socket = new WebSocket(url);


const totalEl = document.getElementById('total');
const errEl = document.getElementById('errors');
const warnEl = document.getElementById('warnings');
const logList = document.getElementById('log-list');


let total=0, errors=0, warnings=0;


socket.addEventListener('open', () => console.log('WS open'));
socket.addEventListener('message', (ev) => {
try{
const msg = JSON.parse(ev.data);
if (msg.type === 'log') handleLog(msg.data);
}catch(e){console.error(e)}
});


function handleLog(log){
total++;
totalEl.innerText = total;
const level = (log.level || 'INFO').toUpperCase();
if (level === 'ERROR') { errors++; errEl.innerText = errors; }
if (level === 'WARN' || level === 'WARNING') { warnings++; warnEl.innerText = warnings; }


const item = document.createElement('div');
item.className = 'log-item ' + (level === 'ERROR' ? 'error' : (level.startsWith('WARN')? 'warn':'info'));
item.innerHTML = `<div><strong>[${log.timestamp}] ${level} / ${log.source}</strong></div><div class="small">${log.message}</div>`;
logList.insertBefore(item, logList.firstChild);
// keep list size reasonable
if (logList.children.length > 1000) logList.removeChild(logList.lastChild);
}
})();