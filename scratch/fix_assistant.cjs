const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/assistant.tsx', 'utf-8');
code = code.replace(
  /dY`< Hello! I am Adhikar AI/,
  '👋 Hello! I am Adhikar AI'
);
fs.writeFileSync('frontend/src/routes/assistant.tsx', code);
