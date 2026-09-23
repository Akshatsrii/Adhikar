const fs = require('fs');

// Fix eligibility.tsx
let elContent = fs.readFileSync('frontend/src/routes/eligibility.tsx', 'utf-8');
elContent = elContent.replace(/import { Link } from '@tanstack\/react-router'/, "import { Link, useNavigate } from '@tanstack/react-router'");
elContent = elContent.replace(/function EligibilityPage\(\) {/, "function EligibilityPage() {\n  const navigate = useNavigate();");
elContent = elContent.replace(/<button type="button" className="w-full bg-\\[#00428a\\] text-white font-bold py-3.5 rounded-md hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-md">/g, "<button type=\"button\" onClick={() => navigate({ to: '/eligibility-results' })} className=\"w-full bg-[#00428a] text-white font-bold py-3.5 rounded-md hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-md\">");
fs.writeFileSync('frontend/src/routes/eligibility.tsx', elContent);

// Fix index.tsx
let idxContent = fs.readFileSync('frontend/src/routes/index.tsx', 'utf-8');
if (!idxContent.includes('useNavigate')) {
  idxContent = idxContent.replace(/import { Link, createFileRoute, Navigate } from '@tanstack\/react-router'/, "import { Link, createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'");
}
idxContent = idxContent.replace(/function LandingPage\(\) {/, "function LandingPage() {\n  const navigate = useNavigate();");
idxContent = idxContent.replace(/<button type="button" className="w-full bg-\\[#00428a\\] text-white font-bold py-2.5 rounded mt-4 hover:bg-blue-800 transition flex items-center justify-center gap-2">/g, "<button type=\"button\" onClick={() => navigate({ to: '/eligibility-results' })} className=\"w-full bg-[#00428a] text-white font-bold py-2.5 rounded mt-4 hover:bg-blue-800 transition flex items-center justify-center gap-2\">");
fs.writeFileSync('frontend/src/routes/index.tsx', idxContent);
