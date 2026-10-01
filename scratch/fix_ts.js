const fs = require('fs');

function fix(file, replaces) {
  let path = 'frontend/src/routes/' + file;
  let code = fs.readFileSync(path, 'utf-8');
  for (let r of replaces) {
    code = code.replace(r[0], r[1]);
  }
  fs.writeFileSync(path, code);
}

fix('__root.tsx', [[/, useNavigate/g, '']]);
fix('about.tsx', [[/const t = /g, '// const t = ']]);
fix('assistant.tsx', [[/, FileText/g, '']]);
fix('contact.tsx', [[/CheckCircle2, /g, '']]);
fix('dashboard.tsx', [[/FileText, /g, ''], [/, Bell/g, '']]);
fix('documents.tsx', [[/Plus, /g, ''], [/, MoreVertical/g, ''], [/, Eye/g, '']]);
fix('eligibility-results.tsx', [[/, AlertCircle/g, '']]);
fix('eligibility.tsx', [[/CheckCircle2, /g, '']]);
fix('index.tsx', [[/Bot, /g, ''], [/FileText, /g, ''], [/CheckCircle2, /g, ''], [/User, /g, ''], [/Phone, /g, '']]);
fix('profile.tsx', [
  [/const navigate = useNavigate\(\)/g, ''],
  [/setAccountForm\({ name: user\.name, email: user\.email \|\| '', phone: user\.phone \|\| '' }\)/g, "setAccountForm({ name: user.name, email: user.email || '' })"],
  [/const \[accountForm, setAccountForm\] = useState\(\{ name: '', email: '', phone: '' \}\)/g, "const [accountForm, setAccountForm] = useState({ name: '', email: '' })"],
  [/phone: accountForm\.phone/g, ''],
  [/<label className=\"block text-sm font-bold text-gray-700 mb-1\">Mobile Number<\/label>[\s\S]*?placeholder=\"Optional, required for OTP Login\"\s*\/>\s*<\/div>/g, '']
]);
fix('track.tsx', [[/, Search/g, '']]);
