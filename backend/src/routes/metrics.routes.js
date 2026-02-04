/**
 * Metrics Routes
 * 
 * API endpoints for daily health metrics management.
 */

import { Router } from 'express';
import { z } from 'zod';
import { 
  createOrUpdateDailyMetric, 
  getMetricsHistory,
  getLatestMetric 
} from '../controllers/metrics.controller.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

/**
 * POST /api/metrics/daily
 * Creates or updates daily health metrics for a user
 * 
 * Request body:
 * {
 *   "userId": "uuid",
 *   "date": "YYYY-MM-DD",
 *   "sleepStart": "HH:mm", // optional
 *   "sleepEnd": "HH:mm",   // optional
 *   "screenTime": 4.5,     // hours
 *   "activityMinutes": 30 // minutes
 * }
 */
const createDailyMetricSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    date: z.string(),
    sleepStart: z.string().optional().nullable(),
    sleepEnd: z.string().optional().nullable(),
    screenTime: z.number().min(0).max(24),
    activityMinutes: z.number().min(0).max(1440),
  }).refine(
    (data) => (data.sleepStart && data.sleepEnd) || (!data.sleepStart && !data.sleepEnd),
    { message: "Both sleep times must be provided together" }
  ),
});

router.post('/daily', validateRequest(createDailyMetricSchema), createOrUpdateDailyMetric);

/**
 * GET /api/metrics/history
 * Returns historical metrics for charts
 * 
 * Query params:
 * - userId: string (uuid)
 * - days: number (default: 30)
 */
const getMetricsHistorySchema = z.object({
  query: z.object({
    userId: z.string().uuid(),
    days: z.string().optional().transform((val) => parseInt(val) || 30),
  }),
});

router.get('/history', validateRequest(getMetricsHistorySchema), getMetricsHistory);

/**
 * GET /api/metrics/latest
 * Returns the most recent metrics entry
 */
const getLatestMetricSchema = z.object({
  query: z.object({
    userId: z.string().uuid(),
  }),
});

router.get('/latest', validateRequest(getLatestMetricSchema), getLatestMetric);

export default router;
