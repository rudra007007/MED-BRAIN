/**
 * Auth Routes
 * 
 * API endpoints for user authentication.
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  signup,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller.js';

const router = Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    validate,
  ],
  signup
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token deletion)
 */
router.post('/logout', protect, logout);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', protect, getMe);

export default router;
