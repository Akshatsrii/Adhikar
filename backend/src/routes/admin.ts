import { Router } from 'express'
import { z } from 'zod'
import { NotificationModel } from '../models/Notification.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { AppError } from '../utils/AppError.js'

import { aiFetch } from '../utils/aiClient.js'

export const adminRouter = Router()

adminRouter.use(requireAuth, requireAdmin)

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

    // Fetch the change first so we know which citizens to notify. The AI
    // service owns regulatory state; Mongo owns who gets told about it.
    const listResponse = await aiFetch(`/regulatory/changes?status=pending`)
    if (!listResponse.ok) {
      throw new AppError('Could not load the pending change', 502)
    }

    const { items } = (await listResponse.json()) as { items: unknown[] }
    const change = z
      .array(changeSchema)
      .parse(items)
      .find((c) => c.id === Number(req.params.id))

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

    res.status(200).json(await response.json())
  } catch (err) {
    next(err)
  }
})

/** Stage 18 — turn an approved change into per-citizen alerts. */
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
