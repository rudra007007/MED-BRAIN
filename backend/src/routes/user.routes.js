/**
 * User Routes
 * 
 * API endpoints for user management.
 */

import { Router } from 'express';
import { createUser, getUser } from '../controllers/user.controller.js';

const router = Router();

/**
 * POST /api/user
 * Creates a new anonymous user
 */
router.post('/', createUser);

/**
 * GET /api/user/:id
 * Gets user by ID
 */
router.get('/:id', getUser);

export default router;
