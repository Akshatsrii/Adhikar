const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/__root.tsx', 'utf-8');
content = content.replace(/<button onClick=\{\(\) => changeLanguage\('hi'\)\}.*?<\/button>/, "<button onClick={() => changeLanguage('hi')} className={i18n.language === 'hi' ? 'text-blue-800' : 'hover:text-blue-600'}>हिन्दी</button>");
fs.writeFileSync('frontend/src/routes/__root.tsx', content);
