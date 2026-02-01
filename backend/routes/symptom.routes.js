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

    db.users[userId].symptomHistory.unshift({
      id: `sym-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      text,
      symptoms: symptoms.data || symptoms,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 entries
    if (db.users[userId].symptomHistory.length > 50) {
      db.users[userId].symptomHistory = db.users[userId].symptomHistory.slice(0, 50);
    }

    res.json({
      success: true,
      data: symptoms.data || symptoms,
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

module.exports = router;
