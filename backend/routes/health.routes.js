const express = require('express');
const router = express.Router();
const { db, sampleHealthData } = require('../data/sample-data');

/**
 * POST /api/health/data
 * Store health data
 */
router.post('/data', async (req, res) => {
  try {
    const { userId, data } = req.body;

    if (!userId || !data) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'userId and data fields are required'
      });
    }

    // Store in memory database
    if (!db.users[userId]) {
      db.users[userId] = {
        id: userId,
        name: userId,
        email: `${userId}@example.com`,
        healthData: [],
        symptomHistory: [],
        createdAt: new Date()
      };
    }

    if (Array.isArray(data)) {
      db.users[userId].healthData.push(...data);
    } else {
      db.users[userId].healthData.push(data);
    }

    res.json({
      success: true,
      message: 'Health data stored',
      data: {
        userId,
        recordCount: Array.isArray(data) ? data.length : 1,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Health data storage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store health data',
      message: error.message
    });
  }
});

/**
 * GET /api/health/data/:userId
 * Retrieve health data for a user
 */
router.get('/data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = db.users[userId];

    if (!user) {
      // Return sample data if user doesn't exist
      return res.json({
        success: true,
        data: sampleHealthData,
        userId,
        message: 'Using sample data'
      });
    }

    res.json({
      success: true,
      data: user.healthData,
      userId
    });
  } catch (error) {
    console.error('Health data retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve health data',
      message: error.message
    });
  }
});

module.exports = router;
