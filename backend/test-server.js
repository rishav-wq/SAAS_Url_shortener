import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

dotenv.config();

// Test with DB connection
console.log('Connecting to database...');
try {
  connectDB();
  console.log('✓ Database connection initiated');
} catch (error) {
  console.error('✗ Database connection error:', error.message);
}

const app = express();

// Test adding security middleware one by one
console.log('Adding security middleware...');

try {
  const { corsConfig, helmetConfig, securityHeaders, requestTiming } = await import('./middleware/security.js');
  app.use(requestTiming);
  console.log('✓ requestTiming added');
  app.use(helmetConfig);
  console.log('✓ helmetConfig added');
  app.use(corsConfig);
  console.log('✓ corsConfig added');
  app.use(securityHeaders);
  console.log('✓ securityHeaders added');
} catch (error) {
  console.error('✗ Error loading security middleware:', error.message);
}

try {
  const { generalLimiter, createLinkLimiter, authLimiter, accessLimiter } = await import('./middleware/rateLimiter.js');
  app.use(generalLimiter);
  console.log('✓ generalLimiter added');
} catch (error) {
  console.error('✗ Error loading rate limiter:', error.message);
}

try {
  const { sanitizeInput } = await import('./middleware/validation.js');
  app.use(sanitizeInput);
  console.log('✓ sanitizeInput added');
} catch (error) {
  console.error('✗ Error loading validation middleware:', error.message);
}

// Just test the basic setup without all the middleware
app.use(express.json());

console.log('Testing authRoutes...');
try {
  const authRoutes = await import('./routes/authRoutes.js');
  const { authLimiter } = await import('./middleware/rateLimiter.js');
  app.use('/api/auth', authLimiter, authRoutes.default);
  console.log('✓ authRoutes loaded successfully with authLimiter');
} catch (error) {
  console.error('✗ Error loading authRoutes:', error.message);
}

console.log('Testing linkRoutes...');
try {
  const linkRoutes = await import('./routes/linkRoutes.js');
  const { createLinkLimiter } = await import('./middleware/rateLimiter.js');
  app.use('/api/links', createLinkLimiter, linkRoutes.default);
  console.log('✓ linkRoutes loaded successfully with createLinkLimiter');
} catch (error) {
  console.error('✗ Error loading linkRoutes:', error.message);
}

console.log('Testing paymentRoutes...');
try {
  const paymentRoutes = await import('./routes/paymentRoutes.js');
  app.use('/api/payments', paymentRoutes.default);
  console.log('✓ paymentRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading paymentRoutes:', error.message);
}

console.log('Testing healthRoutes...');
try {
  const healthRoutes = await import('./routes/healthRoutes.js');
  app.use('/api', healthRoutes.default);
  console.log('✓ healthRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading healthRoutes:', error.message);
}

// Test the redirect route
console.log('Testing redirect route...');
try {
  const { redirectLink } = await import('./controllers/linkController.js');
  const { accessLimiter } = await import('./middleware/rateLimiter.js');
  app.get('/:shortId', accessLimiter, redirectLink);
  console.log('✓ redirect route loaded successfully with accessLimiter');
} catch (error) {
  console.error('✗ Error loading redirect route:', error.message);
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
});
