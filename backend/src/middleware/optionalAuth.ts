import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/tokens.js'

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization

  if (header?.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length)
    try {
      const payload = verifyToken(token)
      req.userId = payload.userId
    } catch {
      // Invalid or expired token — proceed safely as unauthenticated guest
    }
  }

  next()
}
