const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/api.ts', 'utf-8');

const newApi = `

export interface GrievanceRecord {
  _id: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
}

export const grievancesApi = {
  list: async (): Promise<GrievanceRecord[]> => {
    const res = await request<{ items: GrievanceRecord[] }>('/grievances');
    return res.items;
  },
  create: async (data: { subject: string, description: string, category: string }): Promise<GrievanceRecord> => {
    return await request<GrievanceRecord>('/grievances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
`;

code += newApi;
fs.writeFileSync('frontend/src/lib/api.ts', code);
