import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

export function requireInternalKey(req: Request, _res: Response, next: NextFunction): void {
  const key = req.headers['x-internal-key']

  if (!key || key !== env.internalAiKey) {
    next(new AppError('Forbidden: Invalid internal key', 403))
    return
  }

  next()
}
