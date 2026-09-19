import re

with open('backend/src/routes/admin.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Add schemesCache.clear() after each scheme mutation
mutations = ['create_scheme', 'update_scheme', 'delete_scheme', 'bulk_upload_schemes']

for mutation in mutations:
    pattern = r"(action: '" + mutation + r"',\s+target: .*?,\s+ip: req\.ip\s+\}\))"
    text = re.sub(pattern, r"\1\n    schemesCache.clear()", text)

with open('backend/src/routes/admin.ts', 'w', encoding='utf-8') as f:
    f.write(text)
