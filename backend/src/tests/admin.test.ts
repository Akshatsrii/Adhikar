import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { signToken } from '../utils/tokens.js'
import { UserModel } from '../models/User.js'

describe('Admin authorization guard', () => {
  it('returns 401 when accessing admin routes without auth token', async () => {
    const res = await request(app).get('/api/admin/audit')
    expect(res.status).toBe(401)
  })

  it('returns 403 when non-admin citizen token accesses admin routes', async () => {
    // Mock user lookup to return citizen without hanging on DB connection
    vi.spyOn(UserModel, 'findById').mockReturnValue({
      select: vi.fn().mockResolvedValue({ _id: '654321654321654321654321', role: 'citizen' }),
    } as any)

    const citizenToken = signToken({ userId: '654321654321654321654321' })
    const res = await request(app)
      .get('/api/admin/audit')
      .set('Authorization', `Bearer ${citizenToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toContain('Admin access required')
  })
})
