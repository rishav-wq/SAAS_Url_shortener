// middleware/validation.js
import Joi from 'joi';

// Validation schemas
const schemas = {
  createLink: Joi.object({
    originalUrl: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required()
      .max(2048)
      .custom((value, helpers) => {
        // Block malicious/spam domains
        const blockedDomains = [
          'malware.com',
          'phishing.net',
          'spam.site',
          'bit.ly', // Prevent nested shorteners
          'tinyurl.com',
          't.co'
        ];
        
        try {
          const url = new URL(value);
          if (blockedDomains.includes(url.hostname.toLowerCase())) {
            return helpers.error('url.blocked');
          }
          
          // Block localhost/private IPs in production
          if (process.env.NODE_ENV === 'production') {
            if (url.hostname === 'localhost' || 
                url.hostname === '127.0.0.1' || 
                url.hostname.startsWith('192.168.') ||
                url.hostname.startsWith('10.') ||
                url.hostname.startsWith('172.')) {
              return helpers.error('url.private');
            }
          }
          
          return value;
        } catch (error) {
          return helpers.error('url.invalid');
        }
      }, 'URL Security Validation'),
    
    customAlias: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .optional()
      .custom((value, helpers) => {
        // Block reserved words
        const reserved = ['api', 'www', 'admin', 'root', 'dashboard', 'settings', 'login', 'register'];
        if (reserved.includes(value.toLowerCase())) {
          return helpers.error('alias.reserved');
        }
        return value;
      }, 'Alias Validation'),
    
    expiresAt: Joi.date()
      .greater('now')
      .max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) // Max 1 year
      .optional()
  }).messages({
    'url.blocked': 'This domain is not allowed for security reasons',
    'url.private': 'Private/localhost URLs are not allowed in production',
    'url.invalid': 'Please provide a valid HTTP/HTTPS URL',
    'alias.reserved': 'This alias is reserved and cannot be used'
  }),

  register: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Name can only contain letters and spaces'
      }),
    
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .max(255)
      .lowercase(),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .max(255)
      .lowercase(),
    
    password: Joi.string()
      .required()
      .max(128)
  })
};

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schemas[schema].validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Additional security validations
export const sanitizeInput = (req, res, next) => {
  // Remove potential XSS patterns
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};

export default { validate, sanitizeInput };
