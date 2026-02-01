const express = require('express');
const router = express.Router();
const pythonService = require('../services/python.service');
const { db } = require('../data/sample-data');

/**
 * POST /api/symptoms/extract
 * Extract symptoms from natural language text using AI NER model
 */
router.post('/extract', async (req, res) => {
  try {
    const { text, userId = 'default-user' } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Text field is required'
      });
    }

    if (text.length < 3) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Text is too short to analyze'
      });
    }

    const symptoms = await pythonService.extractSymptoms(text);

    // Store in symptom history
    if (!db.users[userId]) {
      db.users[userId] = {
        id: userId,
        name: userId,
        healthData: [],
        symptomHistory: [],
        createdAt: new Date()
      };
    }

    const extractedData = symptoms.data || symptoms;
    db.users[userId].symptomHistory.unshift({
      id: `sym-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      text,
      symptoms: extractedData,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 entries
    if (db.users[userId].symptomHistory.length > 50) {
      db.users[userId].symptomHistory = db.users[userId].symptomHistory.slice(0, 50);
    }

    res.json({
      success: true,
      data: extractedData,
      metadata: {
        textLength: text.length,
        tokensCount: symptoms.tokens ? symptoms.tokens.length : 0,
        entitiesCount: extractedData.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symptom extraction error:', error);
    res.status(500).json({
      success: false,
      error: 'Symptom extraction failed',
      message: error.message
    });
  }
});

/**
 * POST /api/symptoms/relationships
 * Get related symptoms based on symptom graph
 */
router.post('/relationships', async (req, res) => {
  try {
    const { symptom } = req.body;

    if (!symptom) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Symptom field is required'
      });
    }

    const relationships = await pythonService.getSymptomRelationships(symptom);

    res.json({
      success: true,
      data: relationships,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symptom relationship error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get symptom relationships',
      message: error.message
    });
  }
});

/**
 * GET /api/symptoms/history/:userId
 * Get symptom extraction history for a user
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = db.users[userId];

    if (!user) {
      // Return empty history if user doesn't exist
      return res.json({
        success: true,
        data: [],
        userId,
        message: 'No symptom history found'
      });
    }

    res.json({
      success: true,
      data: user.symptomHistory || [],
      userId,
      count: user.symptomHistory ? user.symptomHistory.length : 0,
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

/**
 * POST /api/symptoms/analyze
 * Comprehensive symptom analysis including relationships and recommendations
 */
router.post('/analyze', async (req, res) => {
  try {
    const { symptoms, userId = 'default-user' } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'symptoms array is required'
      });
    }

    const mainSymptom = symptoms[0].normalized || symptoms[0].raw;
    const relationships = await pythonService.getSymptomRelationships(mainSymptom);

    // Generate recommendations based on symptoms
    const recommendations = [];
    const severity = 'mild';

    if (symptoms.length >= 3) {
      recommendations.push('Multiple symptoms detected. Consider consulting a healthcare provider.');
    }

    if (relationships.recommendations) {
      recommendations.push(...relationships.recommendations);
    }

    res.json({
      success: true,
      data: {
        primarySymptom: mainSymptom,
        allSymptoms: symptoms,
        relationships,
        recommendations,
        severity,
        analyzedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze symptoms',
      message: error.message
    });
  }
});

/**
 * GET /api/symptoms/status
 * Get symptom service status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    service: 'symptom-analysis',
    status: 'operational',
    features: ['symptom-extraction', 'relationship-analysis', 'history', 'comprehensive-analysis'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
