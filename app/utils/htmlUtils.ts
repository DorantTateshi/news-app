/**
 * Safely strip HTML tags and get plain text
 */
export function stripHtml(html: string): string {
  if (!html) return ''

  // Remove HTML tags
  const stripped = html.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  const decoded = stripped
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

  // Clean up extra whitespace
  return decoded.replace(/\s+/g, ' ').trim()
}

/**
 * Get a safe preview text from HTML content
 */
export function getPreviewText(html: string, maxLength: number = 150): string {
  const plainText = stripHtml(html)

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Find the last space before the maxLength to avoid cutting words
  const trimmed = plainText.substring(0, maxLength)
  const lastSpace = trimmed.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.8) {
    return trimmed.substring(0, lastSpace) + '...'
  }

  return trimmed + '...'
}

/**
 * Sanitize HTML content for safe display
 * Uses basic sanitization - for production consider adding DOMPurify on client side
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  // Basic sanitization - remove dangerous elements and attributes
  let sanitized = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')

  return sanitized
}