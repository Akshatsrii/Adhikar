import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'

describe('Internal Key security guard', () => {
  it('rejects internal endpoint without x-internal-key header', async () => {
    const res = await request(app).post('/api/internal/notify').send({})
    expect(res.status).toBe(403)
  })

  it('rejects internal endpoint with incorrect x-internal-key header', async () => {
    const res = await request(app)
      .post('/api/internal/notify')
      .set('x-internal-key', 'wrong-key-value')
      .send({})

    expect(res.status).toBe(403)
  })
})
