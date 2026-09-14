export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []

  // Initialize first row and column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Calculate distance
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Returns true if the strings are similar enough.
 * Uses a basic threshold (e.g., max 3 edits for names > 5 chars)
 */
export function isFuzzyMatch(a: string, b: string): boolean {
  const str1 = a.toLowerCase().trim()
  const str2 = b.toLowerCase().trim()
  
  if (str1 === str2) return true

  const dist = levenshteinDistance(str1, str2)
  const maxLength = Math.max(str1.length, str2.length)
  
  // If difference is small relative to the string length, consider it a match
  // E.g., distance 2 is acceptable for length 10.
  const threshold = Math.max(2, Math.floor(maxLength * 0.3))
  return dist <= threshold
}
