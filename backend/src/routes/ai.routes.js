/**
 * AI Routes
 * 
 * API endpoints for AI analysis and insights.
 */

import { Router } from 'express';
import { z } from 'zod';
import { analyzeMetrics, getLatestInsight } from '../controllers/ai.controller.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

/**
 * POST /api/ai/analyze
 * Triggers AI analysis for a user
 * 
 * Request body:
 * {
 *   "userId": "uuid"
 * }
 */
const analyzeSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
  }),
});

router.post('/analyze', validateRequest(analyzeSchema), analyzeMetrics);

/**
 * GET /api/ai/latest
 * Returns the most recent AI insight for a user
 * 
 * Query params:
 * - userId: string (uuid)
 */
const getLatestInsightSchema = z.object({
  query: z.object({
    userId: z.string().uuid(),
  }),
});

router.get('/latest', validateRequest(getLatestInsightSchema), getLatestInsight);

export default router;
