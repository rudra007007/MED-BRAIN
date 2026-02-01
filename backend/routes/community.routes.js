const express = require('express');
const router = express.Router();
const { sampleCommunityTrends } = require('../data/sample-data');

/**
 * GET /api/community/trends
 * Get community health trends
 */
router.get('/trends', (req, res) => {
  try {
    res.json({
      success: true,
      data: sampleCommunityTrends,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Community trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve community trends',
      message: error.message
    });
  }
});

/**
 * GET /api/community/trends/:category
 * Get community trends by category
 */
router.get('/trends/:category', (req, res) => {
  try {
    const { category } = req.params;
    const filtered = sampleCommunityTrends.filter(
      trend => trend.category.toLowerCase() === category.toLowerCase()
    );

    res.json({
      success: true,
      data: filtered,
      category,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Category trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve category trends',
      message: error.message
    });
  }
});

module.exports = router;
