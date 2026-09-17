import type { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/User.js'
import { AppError } from '../utils/AppError.js'

/**
 * Stage 19 RBAC guard. Deliberately re-reads the user's role from the database
 * on every request rather than trusting a claim baked into the JWT: an admin
 * who gets demoted must lose access immediately, not whenever their token
 * happens to expire.
 *
 * Must be mounted after requireAuth.
 */
export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required', 401)
    }

    const user = await UserModel.findById(req.userId).select('role')

    if (!user || user.role !== 'admin') {
      throw new AppError('Admin access required', 403)
    }

    next()
  } catch (err) {
    next(err)
  }
}
