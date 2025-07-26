// Test server with basic security enhancements
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { redirectLink } from './controllers/linkController.js';
import { corsConfig, helmetConfig, securityHeaders, requestTiming } from './middleware/security.js';
import { generalLimiter } from './middleware/rateLimiter.js';

dotenv.config();
connectDB();

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(requestTiming);
app.use(helmetConfig);
app.use(corsConfig);
app.use(securityHeaders);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/payments', paymentRoutes);

// Redirect route
app.get('/:shortId', redirectLink);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Security: Basic enhancements applied`);
});
