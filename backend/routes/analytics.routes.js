const express = require('express');
const router = express.Router();
const pythonService = require('../services/python.service');
const { db } = require('../data/sample-data');

/**
 * POST /api/analytics/drift
 * Analyze drift in health metrics using AI
 */
router.post('/drift', async (req, res) => {
  try {
    const { healthData } = req.body;

    if (!healthData || !Array.isArray(healthData)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'healthData array is required'
      });
    }

    if (healthData.length < 3) {
      // Return sample analysis for limited data
      const sampleAnalysis = await pythonService.analyzeDrift(healthData);
      return res.json({
        success: true,
        data: sampleAnalysis,
        note: 'Analysis based on limited data. More data points will improve accuracy.',
        timestamp: new Date().toISOString()
      });
    }

    const driftAnalysis = await pythonService.analyzeDrift(healthData);

    res.json({
      success: true,
      data: driftAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Drift analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Drift analysis failed',
      message: error.message
    });
  }
});

/**
 * POST /api/analytics/insights
 * Generate health insights from combined symptom and health data
 */
router.post('/insights', async (req, res) => {
  try {
    const { symptoms, healthMetrics } = req.body;

    // Generate insights using the Python service
    const insights = await pythonService.generateInsights(symptoms, healthMetrics);

    res.json({
      success: true,
      data: insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Insights generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights',
      message: error.message
    });
  }
});

/**
 * POST /api/analytics/comprehensive
 * Get comprehensive health analysis including drift, insights, and recommendations
 */
router.post('/comprehensive', async (req, res) => {
  try {
    const { userId = 'default-user' } = req.body;
    const user = db.users[userId] || db.users['default-user'];

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No health data available for this user'
      });
    }

    // Get health data and symptom history
    const healthData = user.healthData || [];
    const symptomHistory = user.symptomHistory || [];

    // Extract symptoms from history
    const allSymptoms = symptomHistory.flatMap(h => h.symptoms || []);

    // Perform drift analysis
    let driftAnalysis = null;
    if (healthData.length >= 3) {
      driftAnalysis = await pythonService.analyzeDrift(healthData);
    }

    // Generate insights
    const healthMetrics = healthData.length > 0 ? {
      avgSteps: healthData.reduce((sum, d) => sum + (d.steps || 0), 0) / healthData.length,
      avgSleep: healthData.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / healthData.length,
      avgHeartRate: healthData.reduce((sum, d) => sum + (d.heart_rate || 0), 0) / healthData.length,
      dataPoints: healthData.length
    } : null;

    const insightsData = await pythonService.generateInsights(allSymptoms, healthMetrics);

    res.json({
      success: true,
      data: {
        driftAnalysis,
        insights: insightsData,
        healthMetrics,
        symptomCount: allSymptoms.length,
        lastUpdated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Comprehensive analysis failed',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/status
 * Get analytics service status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    service: 'analytics',
    status: 'operational',
    features: ['drift-analysis', 'insights-generation', 'comprehensive-analysis'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
