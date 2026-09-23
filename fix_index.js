const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/index.tsx', 'utf-8');

const target = `                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                    <option>Select State</option>
                    <option>Rajasthan</option>
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                  </select>`;

const replacement = `                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                    <option value="">Select State</option>
                    {Object.keys(statesAndDistricts).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>`;

content = content.replace(target, replacement);
fs.writeFileSync('frontend/src/routes/index.tsx', content);
