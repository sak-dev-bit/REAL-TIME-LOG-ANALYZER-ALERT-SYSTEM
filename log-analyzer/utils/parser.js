const fs = require('fs');
const keywords = require('./keywords.json');


function parse(line) {
// naive extraction
// e.g. "2025-12-11T10:02:33Z ERROR auth-service Failed to authenticate user id=123"
const parts = line.trim().split(' ');
let timestamp = parts[0];
let level = parts[1] || 'INFO';
let source = parts[2] || 'generator';
const message = parts.slice(3).join(' ') || line;
return { raw: line, timestamp, level, source, message };
}


function detectKeywords(text) {
const found = [];
const lower = text.toLowerCase();
for (const k of keywords) {
if (lower.includes(k.toLowerCase())) found.push(k);
}
return found;
}


module.exports = { parse, detectKeywords };