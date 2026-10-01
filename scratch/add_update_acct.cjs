const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/api.ts', 'utf-8');

const newMethod = `
  updateAccount: async (payload: { name?: string, email?: string, phone?: string }) =>
    request<{ id: string; name: string; email?: string; phone?: string; profile?: any }>('/profile/account', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
`;

code = code.replace(/deleteAccount: \(\) =>/, newMethod + '\n  deleteAccount: () =>');
fs.writeFileSync('frontend/src/lib/api.ts', code);
