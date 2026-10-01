const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/dashboard.tsx', 'utf-8');
code = code.replace(/<span className="text-xl">.*?<\/span> Welcome/, '<span className="text-xl">👋</span> Welcome');
fs.writeFileSync('frontend/src/routes/dashboard.tsx', code);
