import { Router } from 'express'
import { NotificationModel } from '../models/Notification.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'

export const notificationsRouter = Router()

notificationsRouter.use(requireAuth)

notificationsRouter.get('/', async (req, res, next) => {
  try {
    const unreadOnly = req.query.unread === 'true'

    const filter: Record<string, unknown> = { userId: req.userId }
    if (unreadOnly) filter.readAt = null

    const [notifications, unreadCount] = await Promise.all([
      NotificationModel.find(filter).sort({ createdAt: -1 }).limit(100),
      NotificationModel.countDocuments({ userId: req.userId, readAt: null }),
    ])

    res.status(200).json({ notifications, unreadCount })
  } catch (err) {
    next(err)
  }
})

notificationsRouter.post('/:id/read', async (req, res, next) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { readAt: new Date() } },
      { new: true },
    )

    if (!notification) {
      throw new AppError('Notification not found', 404)
    }

    res.status(200).json({ notification })
  } catch (err) {
    next(err)
  }
})

notificationsRouter.post('/read-all', async (req, res, next) => {
  try {
    const result = await NotificationModel.updateMany(
      { userId: req.userId, readAt: null },
      { $set: { readAt: new Date() } },
    )

    res.status(200).json({ updated: result.modifiedCount })
  } catch (err) {
    next(err)
  }
})
