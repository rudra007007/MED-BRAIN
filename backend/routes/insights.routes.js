const express = require('express');
const router = express.Router();
const { db, samplePatternInsights } = require('../data/sample-data');

/**
 * GET /api/insights
 * Get all pattern insights
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: samplePatternInsights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Insights retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve insights',
      message: error.message
    });
  }
});

/**
 * GET /api/insights/:userId
 * Get insights for specific user
 */
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = db.users[userId];

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // In a real app, this would be personalized
    res.json({
      success: true,
      data: samplePatternInsights,
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user insights',
      message: error.message
    });
  }
});

/**
 * GET /api/insights/symptom-history/:userId
 * Get symptom extraction history for user
 */
router.get('/symptom-history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = db.users[userId];

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.symptomHistory || [],
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symptom history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve symptom history',
      message: error.message
    });
  }
});

module.exports = router;
