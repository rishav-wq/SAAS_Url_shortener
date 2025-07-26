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

// Serve static files in production (for Railway deployment)
if (process.env.NODE_ENV === 'production') {
    // Try multiple possible paths for the frontend build
    const possiblePaths = [
        path.join(process.cwd(), '../frontend/dist'),
        path.join(process.cwd(), '../../frontend/dist'),
        path.join(__dirname, '../frontend/dist'),
        path.join(__dirname, '../../frontend/dist'),
        path.resolve('frontend/dist'),
        path.resolve('../frontend/dist')
    ];
    
    let frontendDistPath = null;
    for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
            frontendDistPath = testPath;
            console.log(`✅ Found frontend build at: ${frontendDistPath}`);
            break;
        }
    }
    
    if (frontendDistPath) {
        app.use(express.static(frontendDistPath));
        
        // Handle React Router - serve index.html for all non-API routes
        app.get('*', (req, res) => {
            // Skip if it's an API route or shortId redirect
            if (req.path.startsWith('/api/') || req.path.match(/^\/[a-zA-Z0-9_-]{6}$/)) {
                return res.status(404).json({ error: 'Route not found' });
            }
            res.sendFile(path.join(frontendDistPath, 'index.html'));
        });
    } else {
        console.log('⚠️ Frontend build directory not found. Serving API only.');
    }
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