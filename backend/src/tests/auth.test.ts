import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'

describe('Auth validation flow', () => {
  it('rejects registration with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Citizen',
        email: 'invalid-email-format',
        password: 'password123',
      })

    expect(res.status).toBe(422)
    expect(res.body).toHaveProperty('message')
  })

  it('rejects login with missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
      })

    expect(res.status).toBe(422)
    expect(res.body).toHaveProperty('message')
  })
})
