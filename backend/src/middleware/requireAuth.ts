import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/AppError.js'
import { verifyToken } from '../utils/tokens.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401)
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = verifyToken(token)
    req.userId = payload.userId
    next()
  } catch {
    throw new AppError('Invalid or expired session', 401)
  }
}
