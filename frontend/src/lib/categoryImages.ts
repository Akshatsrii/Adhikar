/**
 * Authentic, high-resolution photography mapper for Indian welfare schemes and categories.
 * Maps schemes and categories to distinct, diverse, local photos in /schemes/
 */

const CATEGORY_POOLS: Record<string, string[]> = {
  agriculture: [
    '/schemes/agri-farmer.jpg',
    '/schemes/agri-harvest.jpg',
    '/schemes/agri-paddy.jpg',
    '/schemes/agri-landscape.jpg',
  ],
  education: [
    '/schemes/edu-students.jpg',
    '/schemes/edu-girl-study.jpg',
    '/schemes/edu-classroom.jpg',
    '/schemes/edu-graduation.jpg',
  ],
  healthcare: [
    '/schemes/health-doctor.jpg',
    '/schemes/health-clinic.jpg',
    '/schemes/health-checkup.jpg',
    '/schemes/health-care.jpg',
  ],
  housing: [
    '/schemes/house-modern.jpg',
    '/schemes/house-keys.jpg',
    '/schemes/house-family.jpg',
    '/schemes/house-brick.jpg',
  ],
  women: [
    '/schemes/women-empower.jpg',
    '/schemes/women-mother.jpg',
    '/schemes/women-artisan.jpg',
    '/schemes/women-smile.jpg',
  ],
  employment: [
    '/schemes/employ-skills.jpg',
    '/schemes/employ-engineer.jpg',
    '/schemes/employ-workshop.jpg',
    '/schemes/employ-business.jpg',
  ],
  'social welfare': [
    '/schemes/social-senior.jpg',
    '/schemes/social-pension.jpg',
    '/schemes/social-grandparents.jpg',
    '/schemes/social-security.jpg',
  ],
  disability: [
    '/schemes/disability-care.jpg',
    '/schemes/health-clinic.jpg',
  ],
}

// Deterministic string hash to rotate different photos across schemes
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getCategoryImg(category?: string | null, schemeName?: string | null, slug?: string | null): string {
  const c = (category || '').toLowerCase()
  const n = (schemeName || '').toLowerCase()
  const s = (slug || '').toLowerCase()
  const combined = `${c} ${n} ${s}`

  // 1. High-priority keyword matches for specific flagship programs
  if (combined.includes('scooty') || combined.includes('two wheeler') || combined.includes('scooter')) {
    return '/schemes/scooty.jpg'
  }
  if (combined.includes('solar') || combined.includes('surya') || combined.includes('urja') || combined.includes('rooftop')) {
    return '/schemes/solar-energy.jpg'
  }
  if (combined.includes('kisan') || combined.includes('pm-kisan') || combined.includes('farmer') || combined.includes('krishi')) {
    const list = CATEGORY_POOLS.agriculture
    return list[hashString(combined) % list.length]
  }
  if (combined.includes('ayushman') || combined.includes('pmjay') || combined.includes('chiranjeevi') || combined.includes('swasthya') || combined.includes('health') || combined.includes('hospital')) {
    const list = CATEGORY_POOLS.healthcare
    return list[hashString(combined) % list.length]
  }
  if (combined.includes('awas') || combined.includes('pmay') || combined.includes('housing') || combined.includes('makaan') || combined.includes('shelter')) {
    const list = CATEGORY_POOLS.housing
    return list[hashString(combined) % list.length]
  }
  if (combined.includes('ujjwala') || combined.includes('lpg') || combined.includes('gas') || combined.includes('sukanya') || combined.includes('kanya') || combined.includes('sumangala') || combined.includes('ladli') || combined.includes('ladki') || combined.includes('women') || combined.includes('mahila') || combined.includes('maternity')) {
    const list = CATEGORY_POOLS.women
    return list[hashString(combined) % list.length]
  }
  if (combined.includes('scholarship') || combined.includes('anuprati') || combined.includes('coaching') || combined.includes('shiksha') || combined.includes('student') || combined.includes('education') || combined.includes('vidya')) {
    const list = CATEGORY_POOLS.education
    return list[hashString(combined) % list.length]
  }
  if (combined.includes('mudra') || combined.includes('startup') || combined.includes('standup') || combined.includes('vishwakarma') || combined.includes('artisan') || combined.includes('business') || combined.includes('entrepreneur')) {
    return '/schemes/employ-business.jpg'
  }
  if (combined.includes('mgnrega') || combined.includes('rozgar') || combined.includes('skill') || combined.includes('kaushal') || combined.includes('labor') || combined.includes('labour') || combined.includes('employment')) {
    const list = CATEGORY_POOLS.employment
    return list[hashString(combined) % list.length]
  }
  if (combined.includes('pension') || combined.includes('atal') || combined.includes('vaya') || combined.includes('old age') || combined.includes('senior')) {
    const list = CATEGORY_POOLS['social welfare']
    return list[hashString(combined) % list.length]
  }
  if (combined.includes('disab') || combined.includes('divyang')) {
    return '/schemes/disability-care.jpg'
  }

  // 2. Category pool lookup with hash distribution
  for (const [catKey, pool] of Object.entries(CATEGORY_POOLS)) {
    if (c.includes(catKey)) {
      return pool[hashString(combined) % pool.length]
    }
  }

  // 3. Fallback based on hash across all available photos
  const allPhotos = Object.values(CATEGORY_POOLS).flat()
  return allPhotos[hashString(combined) % allPhotos.length] || '/categories/agriculture.jpg'
}

export function getFallbackPhoto(category?: string | null, index: number = 0): string {
  const c = (category || '').toLowerCase()
  for (const [catKey, pool] of Object.entries(CATEGORY_POOLS)) {
    if (c.includes(catKey)) {
      return pool[index % pool.length]
    }
  }
  const allPhotos = Object.values(CATEGORY_POOLS).flat()
  return allPhotos[index % allPhotos.length] || '/schemes/agri-farmer.jpg'
}
