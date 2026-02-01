const express = require('express');
const router = express.Router();
const pythonService = require('../services/python.service');

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

    if (healthData.length < 7) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'At least 7 days of health data required for drift analysis'
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
 * Generate health insights from combined data
 */
router.post('/insights', async (req, res) => {
  try {
    const { symptoms, healthMetrics } = req.body;

    // Placeholder for more sophisticated analysis
    const insights = {
      symptomCount: symptoms ? symptoms.length : 0,
      metricsCount: healthMetrics ? Object.keys(healthMetrics).length : 0,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: insights,
      message: 'Advanced insights coming soon'
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

module.exports = router;
