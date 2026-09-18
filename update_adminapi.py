import re

with open('frontend/src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_admin_api = '''export const adminApi = {
  listChanges: async (status = 'pending'): Promise<RegulatoryChange[]> => {
    const res = await request<{ total: number; items: RawRegulatoryChange[] }>(
      `/admin/regulatory/changes?status=${encodeURIComponent(status)}`,
    )
    return res.items.map(mapChange)
  },

  approve: async (id: number, note?: string): Promise<{ notifications_created: number }> =>
    request<{ notifications_created: number }>(`/admin/regulatory/changes/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  reject: async (id: number, note?: string): Promise<void> => {
    await request<unknown>(`/admin/regulatory/changes/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    })
  },

  getUsers: async (): Promise<AuthUser[]> => 
    request<AuthUser[]>('/admin/users'),

  updateUserRole: async (id: string, role: 'admin' | 'citizen'): Promise<AuthUser> =>
    request<AuthUser>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  createScheme: async (scheme: any): Promise<any> =>
    request<any>('/admin/schemes', {
      method: 'POST',
      body: JSON.stringify(scheme),
    }),

  updateScheme: async (slug: string, scheme: any): Promise<any> =>
    request<any>(`/admin/schemes/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: JSON.stringify(scheme),
    }),

  deleteScheme: async (slug: string): Promise<any> =>
    request<any>(`/admin/schemes/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    }),

  bulkCreateSchemes: async (schemes: any[]): Promise<any> =>
    request<any>('/admin/schemes/bulk', {
      method: 'POST',
      body: JSON.stringify(schemes),
    }),
}'''

content = re.sub(r'export const adminApi = \{.*?(?=\nexport |\Z)', new_admin_api, content, flags=re.DOTALL)

with open('frontend/src/lib/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
