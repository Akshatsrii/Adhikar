const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/api.ts', 'utf-8');

const newMethods = `
  updateAccount: async (payload: { name?: string, email?: string, phone?: string }) =>
    request<{ id: string; name: string; email?: string; phone?: string; profile?: any }>('/profile/account', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAccount: () => request<{ message: string }>('/profile', { method: 'DELETE' }),
`;

code = code.replace(/delete: \(\) => request[^\n]*/, newMethods);
fs.writeFileSync('frontend/src/lib/api.ts', code);
