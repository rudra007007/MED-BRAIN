const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  saveLifestyleData,
  getLifestyleData,
  getLifestyleDataByDate,
  getAnalysis
} = require('../controllers/lifestyleController');

// All routes are protected
router.use(protect);

// Lifestyle data routes
router.route('/')
  .get(getLifestyleData)
  .post(saveLifestyleData);

router.get('/analysis', getAnalysis);
router.get('/:date', getLifestyleDataByDate);

module.exports = router;
