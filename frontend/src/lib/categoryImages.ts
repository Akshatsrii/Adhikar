export function getCategoryImg(category?: string | null): string {
  const c = (category || '').toLowerCase()
  if (c.includes('edu') || c.includes('shiksha') || c.includes('scooty') || c.includes('scholarship')) {
    return '/categories/education.svg'
  }
  if (c.includes('agri') || c.includes('farm') || c.includes('kisan') || c.includes('krishi')) {
    return '/categories/agriculture.svg'
  }
  if (c.includes('health') || c.includes('swasthya') || c.includes('ayush') || c.includes('hospital')) {
    return '/categories/healthcare.svg'
  }
  if (c.includes('hous') || c.includes('awas') || c.includes('makaan') || c.includes('shelter')) {
    return '/categories/housing.svg'
  }
  if (c.includes('employ') || c.includes('skill') || c.includes('job') || c.includes('rozgar') || c.includes('labor')) {
    return '/categories/employment.svg'
  }
  if (c.includes('women') || c.includes('girl') || c.includes('mahila') || c.includes('kanya') || c.includes('chhatra')) {
    return '/categories/women.svg'
  }
  if (c.includes('disab') || c.includes('divyang')) {
    return '/categories/disability.svg'
  }
  if (c.includes('social') || c.includes('welfare') || c.includes('nyay') || c.includes('tribal') || c.includes('backward')) {
    return '/categories/social-welfare.svg'
  }
  return '/categories/default.svg'
}
