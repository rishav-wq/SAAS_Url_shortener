import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { redirectLink } from './controllers/linkController.js';

// Security middleware imports
import { corsConfig, helmetConfig, securityHeaders, requestTiming } from './middleware/security.js';
import { generalLimiter, createLinkLimiter, authLimiter, accessLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput } from './middleware/validation.js';

dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB

const app = express();

// Create necessary directories
const dirs = ['uploads/payment-proofs', 'invoices'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Trust proxy (for accurate IP addresses behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware (applied first)
app.use(requestTiming);
app.use(helmetConfig);
app.use(corsConfig);
app.use(securityHeaders);
app.use(sanitizeInput);

// General rate limiting (applied to all routes)
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use('/invoices', express.static('invoices'));

// Health check routes (no authentication needed)
app.use('/api', healthRoutes);

// API Routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes); // Strict rate limiting for auth
app.use('/api/links', createLinkLimiter, linkRoutes); // Medium rate limiting for link creation  
app.use('/api/payments', paymentRoutes); // Uses general rate limiting

// --- Redirect Route (must be defined *after* API routes) ---
// This handles the root path with a short ID parameter
app.get('/:shortId', accessLimiter, redirectLink);

// API-only deployment - frontend served separately by Vercel
if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Backend running in API-only mode for separate frontend deployment');
    console.log('🌐 Frontend should be deployed to Vercel or similar service');
}

// Global Error Handling Middleware (enhanced)
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);
    
    // Rate limit error
    if (err.status === 429) {
        return res.status(429).json({
            error: 'Too Many Requests',
            message: err.message,
            retryAfter: err.headers?.['Retry-After']
        });
    }
    
    // CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS Error',
            message: 'Origin not allowed'
        });
    }
    
    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    }
    
    // Default error response
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: isDevelopment ? err.message : 'Something went wrong',
        ...(isDevelopment && { stack: err.stack })
    });
});

// 404 handler for unmatched API routes
app.use(/^\/api\//, (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Only show development info in development mode
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        console.log(`🔒 Security: Enhanced with rate limiting, validation, and monitoring`);
    }
});