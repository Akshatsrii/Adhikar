const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/assistant.tsx', 'utf-8');
content = content.replace(/content: ".*Hello! I am Adhikar AI/, 'content: "👋 Hello! I am Adhikar AI');
fs.writeFileSync('frontend/src/routes/assistant.tsx', content);
