const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/__root.tsx', 'utf-8');

// Fix Hindi text inside root.tsx
// Using string replacement so regex special chars don't mess up
content = content.replace(" 1  \"? ݅?", "हिन्दी");
content = content.replace(" 1  \"? ݅?", "हिन्दी");

// Add Footer HTML before the last two closing tags
const footerHtml = `
      <footer className="bg-[#1e293b] text-white pt-12 pb-8 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white p-1 rounded-full flex items-center justify-center shrink-0">
                   <img src="/images/emblem.svg" className="h-full object-contain" alt="Emblem" />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight leading-none">Adhikar</span>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Govt of India</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Adhikar is a centralized AI-powered platform for citizens to discover, understand, and apply for government schemes effortlessly.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/schemes" className="hover:text-white transition">All Schemes</Link></li>
                <li><Link to="/eligibility" className="hover:text-white transition">Check Eligibility</Link></li>
                <li><Link to="/assistant" className="hover:text-white transition">Adhikar AI Chat</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Terms & Conditions</Link></li>
                <li><Link to="/" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition">Copyright Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition">Disclaimer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Helpline: 1800-11-0000</li>
                <li>Email: support@adhikar.gov.in</li>
                <li className="mt-4">
                  <img src="/images/digital-india.svg" alt="Digital India" className="h-8 opacity-80" />
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Adhikar. Designed and Developed by NIC.</p>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </footer>
    </div>`;

content = content.replace(/<\/div>\s*\)\s*}\s*$/, footerHtml + '\n  )\n}\n');
fs.writeFileSync('frontend/src/routes/__root.tsx', content);
