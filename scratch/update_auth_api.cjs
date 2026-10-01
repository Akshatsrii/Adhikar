const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/api.ts', 'utf-8');

const newMethods = `
  sendOtp: async (phone: string): Promise<{ message: string }> => {
    return await request<{ message: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
  },
  verifyOtp: async (data: { phone: string, otp: string }): Promise<AuthResponse> => {
    return await request<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
`;

code = code.replace(/export const authApi = \{/, 'export const authApi = {\n' + newMethods);
fs.writeFileSync('frontend/src/lib/api.ts', code);
