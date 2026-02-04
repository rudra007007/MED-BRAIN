/**
 * MED-BRAIN Backend Application
 * 
 * Production-ready Express application with:
 * - Security middleware (helmet)
 * - Request validation (zod)
 * - Error handling
 * - API versioning
 */

import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';

import { errorHandler } from './middleware/validate.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import metricsRoutes from './routes/metrics.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'med-brain-api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    service: 'MED-BRAIN API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      user: '/api/user',
      metrics: '/api/metrics',
      ai: '/api/ai',
    },
  });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/ai', aiRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

export default app;
