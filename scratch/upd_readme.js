const fs = require('fs');
let code = fs.readFileSync('README.md', 'utf-8');
code = code.replace(
  'A dual-backend AI platform (Node.js + FastAPI + Gemini + pgvector) for government scheme discovery, deterministic eligibility, family optimization, and AI-assisted applications.</i></p>',
  'A dual-backend AI platform (Node.js + FastAPI + Gemini + pgvector) for government scheme discovery, deterministic eligibility, family optimization, and AI-assisted applications.</i></p>\n  <br/>\n  <h3>🚀 <a href="https://adhikar-seven.vercel.app/" target="_blank">Live Demo: adhikar-seven.vercel.app</a> 🚀</h3>'
);
fs.writeFileSync('README.md', code);
