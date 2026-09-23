const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/assistant.tsx', 'utf-8');
content = content.replace("dY`<", "👋");
content = content.replace("import { createFileRoute } from '@tanstack/react-router'", "import { createFileRoute, Navigate } from '@tanstack/react-router'");
content = content.replace("const { user } = useAuth()", "const { user } = useAuth()\n\n  if (!user) {\n    return <Navigate to=\"/login\" replace />\n  }");
fs.writeFileSync('frontend/src/routes/assistant.tsx', content);
