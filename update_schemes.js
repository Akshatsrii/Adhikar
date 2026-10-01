const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/schemes.tsx', 'utf-8');

code = code.replace(/export const Route = createFileRoute\('\/schemes'\)\(\{[\s\S]*?\}\)/, `
type SchemesSearch = { category?: string }
export const Route = createFileRoute('/schemes')({
  validateSearch: (search: Record<string, unknown>): SchemesSearch => {
    return { category: search.category as string | undefined }
  },
  component: SchemesPage,
})
`.trim());

// We will just read it first to see its exact content.
console.log(code.includes('filteredSchemes'));
fs.writeFileSync('frontend/src/routes/schemes.tsx', code);
