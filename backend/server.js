const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

// Load routes safely
let symptomRoutes, healthRoutes, analyticsRoutes, insightsRoutes, communityRoutes;

try {
  symptomRoutes = require('./routes/symptom.routes');
  healthRoutes = require('./routes/health.routes');
  analyticsRoutes = require('./routes/analytics.routes');
  insightsRoutes = require('./routes/insights.routes');
  communityRoutes = require('./routes/community.routes');
} catch (routeError) {
  console.error('❌ Error loading routes:', routeError.message);
  console.error(routeError.stack);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/symptoms', symptomRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/community', communityRoutes);

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MED-BRAIN Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 MED-BRAIN Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/status`);
  console.log(`✅ Server is actively listening and ready for requests`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Prevent hanging processes
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught exception:', err.message);
  console.error('Stack:', err.stack);
  // Don't exit - let server continue
});

module.exports = app;
