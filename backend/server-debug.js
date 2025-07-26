import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import connectDB from './utils/db.js';

// Load environment first
dotenv.config();

console.log('Step 1: Starting server debug...');

// Connect to database
console.log('Step 2: Connecting to database...');
connectDB();

const app = express();

console.log('Step 3: Setting up basic middleware...');
app.set('trust proxy', 1);

// Create necessary directories
const dirs = ['uploads/payment-proofs', 'invoices'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Step 4: Adding express middleware...');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('Step 5: Adding static file middleware...');
app.use('/uploads', express.static('uploads'));
app.use('/invoices', express.static('invoices'));

console.log('Step 6: Loading security middleware...');
try {
  const { corsConfig, helmetConfig, securityHeaders, requestTiming } = await import('./middleware/security.js');
  app.use(requestTiming);
  app.use(helmetConfig);
  app.use(corsConfig);
  app.use(securityHeaders);
  console.log('✓ Security middleware loaded');
} catch (error) {
  console.error('✗ Error loading security middleware:', error);
  process.exit(1);
}

console.log('Step 7: Loading rate limiting middleware...');
try {
  const { generalLimiter, createLinkLimiter, authLimiter, accessLimiter } = await import('./middleware/rateLimiter.js');
  app.use(generalLimiter);
  console.log('✓ Rate limiting middleware loaded');
} catch (error) {
  console.error('✗ Error loading rate limiting middleware:', error);
  process.exit(1);
}

console.log('Step 8: Loading validation middleware...');
try {
  const { sanitizeInput } = await import('./middleware/validation.js');
  app.use(sanitizeInput);
  console.log('✓ Validation middleware loaded');
} catch (error) {
  console.error('✗ Error loading validation middleware:', error);
  process.exit(1);
}

console.log('Step 9: Loading routes...');

// Health routes first
console.log('Step 9a: Loading health routes...');
try {
  const healthRoutes = await import('./routes/healthRoutes.js');
  app.use('/api', healthRoutes.default);
  console.log('✓ Health routes loaded');
} catch (error) {
  console.error('✗ Error loading health routes:', error);
  process.exit(1);
}

// Auth routes
console.log('Step 9b: Loading auth routes...');
try {
  const authRoutes = await import('./routes/authRoutes.js');
  const { authLimiter } = await import('./middleware/rateLimiter.js');
  app.use('/api/auth', authLimiter, authRoutes.default);
  console.log('✓ Auth routes loaded');
} catch (error) {
  console.error('✗ Error loading auth routes:', error);
  process.exit(1);
}

// Link routes
console.log('Step 9c: Loading link routes...');
try {
  const linkRoutes = await import('./routes/linkRoutes.js');
  const { createLinkLimiter } = await import('./middleware/rateLimiter.js');
  app.use('/api/links', createLinkLimiter, linkRoutes.default);
  console.log('✓ Link routes loaded');
} catch (error) {
  console.error('✗ Error loading link routes:', error);
  process.exit(1);
}

// Payment routes
console.log('Step 9d: Loading payment routes...');
try {
  const paymentRoutes = await import('./routes/paymentRoutes.js');
  app.use('/api/payments', paymentRoutes.default);
  console.log('✓ Payment routes loaded');
} catch (error) {
  console.error('✗ Error loading payment routes:', error);
  process.exit(1);
}

// Redirect route (this is the critical one)
console.log('Step 10: Loading redirect route...');
try {
  const { redirectLink } = await import('./controllers/linkController.js');
  const { accessLimiter } = await import('./middleware/rateLimiter.js');
  app.get('/:shortId', accessLimiter, redirectLink);
  console.log('✓ Redirect route loaded');
} catch (error) {
  console.error('✗ Error loading redirect route:', error);
  process.exit(1);
}

console.log('Step 11: Adding error handling...');
app.use((err, req, res, next) => {
  console.error(`Error:`, err.stack);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `Route ${req.originalUrl} not found`
  });
});

console.log('Step 12: Starting server...');
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Debug server running successfully on port ${PORT}`);
});
