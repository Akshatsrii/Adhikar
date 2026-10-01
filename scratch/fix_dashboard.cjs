const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/dashboard.tsx', 'utf-8');

// 1. Calculate profile completion
code = code.replace(
  /const firstName = user\?\.name\?\.split\(' '\)\[0\] \|\| 'Citizen'/,
  `const firstName = user?.name?.split(' ')[0] || 'Citizen'

  // Dynamic Profile Completion
  let filledFields = 0;
  const totalFields = 6;
  if (user?.profile) {
    if (user.profile.age) filledFields++;
    if ((user.profile as any).dob) filledFields++;
    if (user.profile.state) filledFields++;
    if (user.profile.education) filledFields++;
    if (user.profile.income) filledFields++;
    if (user.profile.occupation) filledFields++;
  }
  const completionPercentage = Math.round((filledFields / totalFields) * 100);
  const strokeDasharray = \`\${completionPercentage}, 100\`;`
);

// 2. Fix the emoji and stroke dash array
code = code.replace(
  /<span className="text-xl">dY`<<\/span>/,
  '<span className="text-xl">👋</span>'
);

code = code.replace(
  /<path className="text-\[\#00428a\]" strokeWidth="3" strokeDasharray="80, 100"/,
  '<path className="text-[#00428a]" strokeWidth="3" strokeDasharray={strokeDasharray}'
);

code = code.replace(
  /<span className="absolute text-lg font-bold text-\[\#00428a\]">80%<\/span>/,
  '<span className="absolute text-lg font-bold text-[#00428a]">{completionPercentage}%</span>'
);

code = code.replace(
  /<button className="text-\[\#00428a\] font-bold text-xs border border-\[\#00428a\] rounded px-4 py-1\.5 hover:bg-blue-50 transition">\s+Complete Profile\s+<\/button>/,
  `<Link to="/profile" className="inline-block text-[#00428a] font-bold text-xs border border-[#00428a] rounded px-4 py-1.5 hover:bg-blue-50 transition">\n                Update Profile\n              </Link>`
);

fs.writeFileSync('frontend/src/routes/dashboard.tsx', code);
