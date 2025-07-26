// routes/healthRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Link from '../models/Link.js';
import User from '../models/User.js';
import os from 'os';

const router = express.Router();

// Basic health check
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };

    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Health check failed'
    });
  }
});

// Detailed health check with dependencies
router.get('/health/detailed', async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    checks: {}
  };

  try {
    // Database connectivity check
    checks.checks.database = {
      status: mongoose.connection.readyState === 1 ? 'ok' : 'error',
      responseTime: 0
    };

    if (mongoose.connection.readyState === 1) {
      const dbStart = Date.now();
      await mongoose.connection.db.admin().ping();
      checks.checks.database.responseTime = Date.now() - dbStart;
    }

    // Memory usage check
    const memUsage = process.memoryUsage();
    checks.checks.memory = {
      status: memUsage.heapUsed < 500 * 1024 * 1024 ? 'ok' : 'warning', // 500MB threshold
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
      rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB'
    };

    // System metrics
    checks.checks.system = {
      status: 'ok',
      cpuLoad: os.loadavg(),
      freeMem: Math.round(os.freemem() / 1024 / 1024) + 'MB',
      totalMem: Math.round(os.totalmem() / 1024 / 1024) + 'MB',
      uptime: Math.round(os.uptime()),
      platform: os.platform(),
      arch: os.arch()
    };

    // Application metrics
    const linkCount = await Link.countDocuments();
    const userCount = await User.countDocuments();
    
    checks.checks.application = {
      status: 'ok',
      totalLinks: linkCount,
      totalUsers: userCount,
      activeConnections: mongoose.connections.length
    };

    // Overall status
    const hasErrors = Object.values(checks.checks).some(check => check.status === 'error');
    checks.status = hasErrors ? 'error' : 'ok';

    res.status(hasErrors ? 503 : 200).json(checks);

  } catch (error) {
    checks.status = 'error';
    checks.error = error.message;
    res.status(503).json(checks);
  }
});

// Readiness check (for Kubernetes)
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not ready');
    }

    // Perform a simple database query
    await User.findOne().limit(1);

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check (for Kubernetes)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Metrics endpoint (Prometheus format)
router.get('/metrics', async (req, res) => {
  try {
    const linkCount = await Link.countDocuments();
    const userCount = await User.countDocuments();
    const memUsage = process.memoryUsage();

    const metrics = `
# HELP links_total Total number of links created
# TYPE links_total counter
links_total ${linkCount}

# HELP users_total Total number of registered users
# TYPE users_total counter  
users_total ${userCount}

# HELP memory_usage_bytes Memory usage in bytes
# TYPE memory_usage_bytes gauge
memory_usage_bytes{type="heap_used"} ${memUsage.heapUsed}
memory_usage_bytes{type="heap_total"} ${memUsage.heapTotal}
memory_usage_bytes{type="rss"} ${memUsage.rss}

# HELP uptime_seconds Process uptime in seconds
# TYPE uptime_seconds counter
uptime_seconds ${Math.round(process.uptime())}
    `.trim();

    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate metrics' });
  }
});

export default router;
