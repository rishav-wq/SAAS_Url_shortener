// utils/urlHelper.js
import dotenv from 'dotenv';

dotenv.config();

/**
 * Get the base URL for shortened links
 * @param {Object} req - Express request object
 * @returns {string} Base URL for shortened links
 */
export const getBaseUrl = (req) => {
  // Priority order:
  // 1. BASE_URL environment variable (for production)
  // 2. Fallback to request host (for development)
  
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // Development fallback
  return `${req.protocol}://${req.get('host')}`;
};

/**
 * Generate a complete short URL
 * @param {string} shortId - The short ID for the link
 * @param {Object} req - Express request object
 * @returns {string} Complete short URL
 */
export const generateShortUrl = (shortId, req) => {
  const baseUrl = getBaseUrl(req);
  return `${baseUrl}/${shortId}`;
};

/**
 * Check if we're in production mode
 * @returns {boolean} True if in production
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export default {
  getBaseUrl,
  generateShortUrl,
  isProduction
};
