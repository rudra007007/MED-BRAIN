const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createPost,
  getFeed,
  getPost,
  addComment,
  addReaction,
  removeReaction,
  getMyPosts
} = require('../controllers/communityController');

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

// All routes are protected
router.use(protect);

// Community routes
router.get('/my-posts', getMyPosts);
router.get('/posts', getFeed);
router.get('/posts/:id', getPost);

router.post('/posts', [
  body('postType').isIn(['insight', 'progress', 'support']),
  body('content').isLength({ min: 10, max: 2000 }),
  validate
], createPost);

router.post('/posts/:id/comments', [
  body('content').isLength({ min: 1, max: 500 }),
  validate
], addComment);

router.post('/posts/:id/reactions', [
  body('type').isIn(['support', 'encouraging', 'celebrate']),
  validate
], addReaction);

router.delete('/posts/:id/reactions', removeReaction);

module.exports = router;
