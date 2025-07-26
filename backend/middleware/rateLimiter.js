// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Link creation rate limiting (more strict)
export const createLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 link creations per windowMs
  message: {
    error: 'Too many links created from this IP, please try again later.',
    retryAfter: 15 * 60,
    tip: 'Consider upgrading to a premium plan for higher limits'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiting (very strict)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Link access rate limiting (for /:shortId endpoint)
export const accessLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 link clicks per minute
  message: {
    error: 'Too many link accesses, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  generalLimiter,
  createLinkLimiter,
  authLimiter,
  accessLimiter
};
