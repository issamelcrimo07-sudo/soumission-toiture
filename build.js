// build.js — Injecte GOOGLE_MAPS_API_KEY dans index.html au moment du déploiement Vercel
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
const src  = path.join(__dirname, 'index.html');
const dest = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

let html = fs.readFileSync(src, 'utf8');
html = html.replace(/__GOOGLE_MAPS_API_KEY__/g, apiKey);
fs.writeFileSync(dest, html, 'utf8');

console.log('Build OK — API key ' + (apiKey ? 'injectee (' + apiKey.slice(0,8) + '...)' : 'ABSENTE (carte desactivee)'));
