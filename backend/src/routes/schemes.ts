import { Router } from 'express'
import { SchemeModel } from '../models/Scheme.js'
import { aiFetch } from '../utils/aiClient.js'
import { AppError } from '../utils/AppError.js'
import { LRUCache } from 'lru-cache'

export const schemesRouter = Router()

const schemesCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 min
})

schemesRouter.get('/', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0
    const limit = parseInt(req.query.limit as string) || 50
    const category = req.query.category as string
    const state = req.query.state as string
    const query = req.query.query as string

    const cacheKey = `schemes:${skip}:${limit}:${category || ''}:${state || ''}:${query || ''}`
    
    if (schemesCache.has(cacheKey)) {
      res.json(schemesCache.get(cacheKey))
      return
    }

    // Try AI Backend first for semantic search if 'query' is provided
    if (query) {
      try {
        const response = await aiFetch(`/schemes?q=${encodeURIComponent(query)}&offset=${skip}&limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          schemesCache.set(cacheKey, data)
          return res.json(data)
        }
      } catch (err) {
        console.warn("AI semantic search failed, falling back to local DB search")
      }
    }

    // Standard Database Query
    const filter: any = {}
    if (category) filter.category = new RegExp(category, 'i')
    if (state) filter.state = new RegExp(state, 'i')
    if (query) filter.name = new RegExp(query, 'i')

    const total = await SchemeModel.countDocuments(filter)
    const items = await SchemeModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    const data = { total, items }
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

    const scheme = await SchemeModel.findOne({ slug: req.params.slug }).lean()
    
    if (!scheme) {
      // If not in primary DB, try AI fallback (legacy)
      try {
        const response = await aiFetch(`/schemes/${encodeURIComponent(req.params.slug)}`)
        if (response.ok) {
          const data = await response.json()
          schemesCache.set(cacheKey, data)
          return res.json(data)
        }
      } catch (err) {}
      throw new AppError('Scheme not found', 404)
    }

    schemesCache.set(cacheKey, scheme)
    res.json(scheme)
  } catch (err) {
    next(err)
  }
})
