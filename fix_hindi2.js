const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/__root.tsx', 'utf-8');
let lines = content.split('\n');
let newLines = lines.map(line => {
  if (line.includes("changeLanguage('hi')")) {
    return "              <button onClick={() => changeLanguage('hi')} className={i18n.language === 'hi' ? 'text-blue-800' : 'hover:text-blue-600'}>हिन्दी</button>";
  }
  return line;
});
fs.writeFileSync('frontend/src/routes/__root.tsx', newLines.join('\n'));
