const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  saveOnboarding,
  updatePreferences,
  getProfile,
  updateProfile
} = require('../controllers/userController');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// User routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.post('/onboarding', protect, [
  body('ageRange').optional().isIn(['18-24', '25-34', '35-44', '45-54', '55-64', '65+']),
  body('routinePreferences').optional().isIn(['morning', 'evening', 'flexible']),
  body('goals').optional().isArray(),
  body('primaryFocus').optional().isIn(['sleep', 'activity', 'nutrition', 'stress', 'overall']),
  validate
], saveOnboarding);

router.put('/preferences', protect, [
  body('insightTone').optional().isIn(['encouraging', 'neutral', 'direct']),
  body('notifications').optional().isObject(),
  validate
], updatePreferences);

module.exports = router;
