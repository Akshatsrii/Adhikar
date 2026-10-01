const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/dashboard.tsx', 'utf-8');
const target = '<span className="text-xl">dY`<</span> Welcome';
const replacement = '<span className="text-xl">👋</span> Welcome';
if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('frontend/src/routes/dashboard.tsx', code);
  console.log("Replaced!");
} else {
  console.log("Not found.");
}
