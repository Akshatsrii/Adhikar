import { Router } from 'express'
import { aiFetch } from '../utils/aiClient.js'
import { AppError } from '../utils/AppError.js'
import { LRUCache } from 'lru-cache'
import fs from 'fs'
import path from 'path'

export const schemesRouter = Router()

const schemesCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 min
})

// Fallback loader to read from seed data if backend DB is down (e.g. Docker restart)
function getFallbackSchemes() {
  try {
    const filePath = path.resolve(process.cwd(), '../ai-service/data/schemes_seed.json')
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
  } catch (e) {
    console.error("Failed to load fallback schemes", e)
  }
  return []
}

schemesRouter.get('/', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0
    const limit = parseInt(req.query.limit as string) || 50
    const cacheKey = `schemes:${skip}:${limit}`
    
    if (schemesCache.has(cacheKey)) {
      res.json(schemesCache.get(cacheKey))
      return
    }

    try {
      const response = await aiFetch(`/schemes?offset=${skip}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        schemesCache.set(cacheKey, data)
        return res.json(data)
      }
    } catch (err) {
      console.warn("AI backend failed, falling back to JSON seed data")
    }

    // Fallback logic
    const allSchemes = getFallbackSchemes()
    const paginated = allSchemes.slice(skip, skip + limit)
    const data = { total: allSchemes.length, items: paginated }
    schemesCache.set(cacheKey, data)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

schemesRouter.get('/:slug', async (req, res, next) => {
  try {
    const cacheKey = `scheme:${req.params.slug}`
    
    if (schemesCache.has(cacheKey)) {
      res.json(schemesCache.get(cacheKey))
      return
    }

    try {
      const response = await aiFetch(`/schemes/${encodeURIComponent(req.params.slug)}`)
      if (response.ok) {
        const data = await response.json()
        schemesCache.set(cacheKey, data)
        return res.json(data)
      }
    } catch (err) {
      console.warn("AI backend failed, falling back to JSON seed data")
    }

    // Fallback logic
    const allSchemes = getFallbackSchemes()
    const scheme = allSchemes.find((s: any) => s.slug === req.params.slug)
    if (!scheme) {
      throw new AppError('Scheme not found', 404)
    }
    schemesCache.set(cacheKey, scheme)
    res.json(scheme)
  } catch (err) {
    next(err)
  }
})
