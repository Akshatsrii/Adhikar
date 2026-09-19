import { Router } from 'express'
import { z } from 'zod'
import { NotificationModel } from '../models/Notification.js'
import { UserModel } from '../models/User.js'
import { AuditLogModel } from '../models/AuditLog.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { AppError } from '../utils/AppError.js'

import { aiFetch } from '../utils/aiClient.js'

export const adminRouter = Router()

adminRouter.use(requireAuth, requireAdmin)

// ======================= User Management =======================

adminRouter.get('/users', async (_req, res, next) => {
  try {
    const users = await UserModel.find({}, '-passwordHash').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

adminRouter.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = z.object({ role: z.enum(['admin', 'citizen']) }).parse(req.body)
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash')
    
    if (!user) throw new AppError('User not found', 404)
    
    await AuditLogModel.create({
      adminId: req.userId,
      action: 'change_user_role',
      target: `user:${req.params.id}`,
      ip: req.ip
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// ======================= Scheme CRUD =======================

import { LRUCache } from 'lru-cache'

const schemesCache = new LRUCache<string, any>({
  max: 100, // cache 100 different page requests
  ttl: 1000 * 60 * 5, // 5 min
})

adminRouter.get('/schemes', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0
    const limit = parseInt(req.query.limit as string) || 50
    const cacheKey = `schemes:${skip}:${limit}`
    
    if (schemesCache.has(cacheKey)) {
      res.json(schemesCache.get(cacheKey))
      return
    }

    const response = await aiFetch(`/schemes?offset=${skip}&limit=${limit}`)
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`AI service error: ${detail || response.statusText}`, 502)
    }
    const data = await response.json()
    schemesCache.set(cacheKey, data)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

adminRouter.post('/schemes', async (req, res, next) => {
  try {
    const response = await aiFetch('/admin/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`AI service error: ${detail || response.statusText}`, 502)
    }
    
    await AuditLogModel.create({
      adminId: req.userId,
      action: 'create_scheme',
      target: req.body.slug || `unknown`,
      ip: req.ip
    })
    schemesCache.clear()
    res.status(201).json(await response.json())
  } catch (err) {
    next(err)
  }
})

adminRouter.put('/schemes/:slug', async (req, res, next) => {
  try {
    const response = await aiFetch(`/admin/schemes/${encodeURIComponent(req.params.slug)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`AI service error: ${detail || response.statusText}`, 502)
    }
    
    await AuditLogModel.create({
      adminId: req.userId,
      action: 'update_scheme',
      target: `scheme:${req.params.slug}`,
      ip: req.ip
    })
    schemesCache.clear()
    res.json(await response.json())
  } catch (err) {
    next(err)
  }
})

adminRouter.delete('/schemes/:slug', async (req, res, next) => {
  try {
    const response = await aiFetch(`/admin/schemes/${encodeURIComponent(req.params.slug)}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`AI service error: ${detail || response.statusText}`, 502)
    }
    
    await AuditLogModel.create({
      adminId: req.userId,
      action: 'delete_scheme',
      target: `scheme:${req.params.slug}`,
      ip: req.ip
    })
    schemesCache.clear()
    res.json(await response.json())
  } catch (err) {
    next(err)
  }
})

adminRouter.post('/schemes/bulk', async (req, res, next) => {
  try {
    const response = await aiFetch('/admin/schemes/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`AI service error: ${detail || response.statusText}`, 502)
    }
    
    await AuditLogModel.create({
      adminId: req.userId,
      action: 'bulk_upload_schemes',
      target: `bulk`,
      ip: req.ip
    })
    schemesCache.clear()
    res.status(201).json(await response.json())
  } catch (err) {
    next(err)
  }
})

const reviewSchema = z.object({
  note: z.string().trim().max(500).optional(),
})

const impactSchema = z
  .object({
    lost_eligibility_user_ids: z.array(z.string()).default([]),
    gained_eligibility_user_ids: z.array(z.string()).default([]),
  })
  .nullable()

const changeSchema = z.object({
  id: z.number(),
  scheme_slug: z.string(),
  scheme_name: z.string(),
  change_type: z.string(),
  summary: z.string(),
  source_url: z.string(),
  impact: impactSchema,
})

adminRouter.get('/regulatory/changes', async (req, res, next) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : 'pending'

    const response = await aiFetch(
      `/regulatory/changes?status=${encodeURIComponent(status)}`,
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`Regulatory service error: ${detail || response.statusText}`, 502)
    }

    res.status(200).json(await response.json())
  } catch (err) {
    next(err)
  }
})

adminRouter.get('/regulatory/schemes/:slug/versions', async (req, res, next) => {
  try {
    const response = await aiFetch(
      `/regulatory/schemes/${encodeURIComponent(req.params.slug)}/versions`,
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`Regulatory service error: ${detail || response.statusText}`, 502)
    }

    res.status(200).json(await response.json())
  } catch (err) {
    next(err)
  }
})

adminRouter.post('/regulatory/changes/:id/approve', async (req, res, next) => {
  try {
    const { note } = reviewSchema.parse(req.body ?? {})

    const listResponse = await aiFetch(`/regulatory/changes?status=pending`)
    if (!listResponse.ok) {
      throw new AppError('Could not load the pending change', 502)
    }

    const { items } = (await listResponse.json()) as { items: unknown[] }
    const changeId = Number(req.params.id)
    const change = z
      .array(changeSchema)
      .parse(items)
      .find((c) => c.id === changeId)

    if (!change) {
      throw new AppError('Pending change not found', 404)
    }

    const approveResponse = await aiFetch(
      `/regulatory/changes/${req.params.id}/approve`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewed_by: req.userId, note }),
      },
    )

    if (!approveResponse.ok) {
      const detail = await approveResponse.text().catch(() => '')
      throw new AppError(`Approval failed: ${detail || approveResponse.statusText}`, 502)
    }

    const result = (await approveResponse.json()) as Record<string, unknown>
    const notified = await fanOutNotifications(change)

    
    await AuditLogModel.create({
      adminId: req.userId,
      action: 'approve_change',
      target: `regulatory_change:${req.params.id}`,
      ip: req.ip
    })
    res.status(200).json({ ...result, notifications_created: notified })
  } catch (err) {
    next(err)
  }
})

adminRouter.post('/regulatory/changes/:id/reject', async (req, res, next) => {
  try {
    const { note } = reviewSchema.parse(req.body ?? {})

    const response = await aiFetch(
      `/regulatory/changes/${req.params.id}/reject`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewed_by: req.userId, note }),
      },
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AppError(`Rejection failed: ${detail || response.statusText}`, 502)
    }

    
    await AuditLogModel.create({
      adminId: req.userId,
      action: 'reject_change',
      target: `regulatory_change:${req.params.id}`,
      ip: req.ip
    })
    res.status(200).json(await response.json())
  } catch (err) {
    next(err)
  }
})

async function fanOutNotifications(change: z.infer<typeof changeSchema>): Promise<number> {
  if (!change.impact) return 0

  const docs = [
    ...change.impact.lost_eligibility_user_ids.map((userId) => ({
      userId,
      kind: 'eligibility_lost' as const,
      title: 'Your eligibility may have changed',
      body:
        `${change.scheme_name} has updated its rules — ${change.summary} ` +
        `You may no longer qualify. Please review your eligibility.`,
    })),
    ...change.impact.gained_eligibility_user_ids.map((userId) => ({
      userId,
      kind: 'eligibility_gained' as const,
      title: 'You may now qualify for a new scheme',
      body:
        `${change.scheme_name} has updated its rules — ${change.summary} ` +
        `You may now be eligible.`,
    })),
  ].map((d) => ({
    ...d,
    schemeSlug: change.scheme_slug,
    schemeName: change.scheme_name,
    regulatoryChangeId: change.id,
    sourceUrl: change.source_url,
  }))

  if (docs.length === 0) return 0

  await NotificationModel.insertMany(docs)
  return docs.length
}
