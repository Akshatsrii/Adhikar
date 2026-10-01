const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/api.ts', 'utf-8');

const newMethods = `
  forgotPassword: async (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: async (data: { email: string, otp: string, newPassword: string }) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
`;

code = code.replace(/verifyOtp: async/, newMethods + '\n  verifyOtp: async');
fs.writeFileSync('frontend/src/lib/api.ts', code);
