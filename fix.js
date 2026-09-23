const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/__root.tsx', 'utf-8');

// Replace Emblem URL
content = content.replace(/<img[^>]*alt="Emblem"[^>]*>/g, '<img src="/images/emblem.svg" className="h-4" alt="Emblem" />');

// Replace the text for government of india
content = content.replace(/<span>[^<]*\| Government of India<\/span>/g, '<span>भारत सरकार | Government of India</span>');

// Replace hindi lang button
content = content.replace(/<button className="text-blue-800">[^<]*<\/button>\s*<span className="text-gray-400">\|<\/span>/g, '<button className="text-blue-800">हिन्दी</button>\n              <span className="text-gray-400\">|</span>');

// Replace meri sarkar text
content = content.replace(/<span className="text-\[10px\] text-gray-500 font-bold uppercase tracking-widest mt-0\.5">[^<]*<\/span>/g, '<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">मेरी सरकार, मेरा अधिकार</span>');

// Replace digital india URL
content = content.replace(/<img[^>]*alt="Digital India"[^>]*>/g, '<img src="/images/digital-india.svg" alt="Digital India" className="h-8 opacity-90" />');

// Remove G20 Logo entirely
content = content.replace(/\s*<img[^>]*alt="G20"[^>]*>\s*/g, '');

fs.writeFileSync('frontend/src/routes/__root.tsx', content);
