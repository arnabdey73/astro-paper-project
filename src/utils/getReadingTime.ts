/**
 * Estimate reading time for a given text
 * @param {string} text - The text to estimate reading time for
 * @param {number} wordsPerMinute - Words per minute reading speed (default: 200)
 * @returns {number} - Estimated reading time in minutes
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time;
}
