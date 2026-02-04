/**
 * Zod Validation Schemas for MED-BRAIN API
 * 
 * These schemas ensure request validation before reaching controllers.
 * Clear error messages help frontend developers debug issues.
 */

import { z } from 'zod';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * User validation schemas
 */
export const createUserSchema = {
  // No input required - user creation is automatic
  body: z.object({}).optional()
};

/**
 * Daily metrics validation schema
 * Handles sleep calculation for cross-midnight scenarios
 */
export const createDailyMetricSchema = {
  body: z.object({
    userId: z.string().uuid({ message: "Invalid user ID format" }),
    date: z.string().refine(
      (val) => !isNaN(Date.parse(val)),
      { message: "Invalid date format. Use ISO 8601 format (YYYY-MM-DD)" }
    ),
    sleepStart: z.string().regex(timeRegex, {
      message: "Invalid sleep start time. Use HH:mm format (24-hour)"
    }).optional().nullable(),
    sleepEnd: z.string().regex(timeRegex, {
      message: "Invalid sleep end time. Use HH:mm format (24-hour)"
    }).optional().nullable(),
    screenTime: z.number().min(0, { message: "Screen time cannot be negative" }).max(24, {
      message: "Screen time cannot exceed 24 hours"
    }),
    activityMinutes: z.number().min(0, { message: "Activity minutes cannot be negative" }).max(1440, {
      message: "Activity minutes cannot exceed 1440 (24 hours)"
    })
  }).refine(
    (data) => {
      // Validate: if one sleep time is provided, both must be provided
      if ((data.sleepStart && !data.sleepEnd) || (!data.sleepStart && data.sleepEnd)) {
        return false;
      }
      return true;
    },
    {
      message: "Both sleep start and end times must be provided together",
      path: ["sleepStart"]
    }
  )
};

/**
 * Metrics history query validation
 */
export const getMetricsHistorySchema = {
  query: z.object({
    userId: z.string().uuid({ message: "Invalid user ID format" }),
    days: z.string().optional().transform((val) => {
      if (!val) return 30; // Default to 30 days
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) return 30;
      return Math.min(Math.max(parsed, 1), 365); // Clamp between 1 and 365
    })
  })
};

/**
 * AI Analysis request validation
 */
export const analyzeMetricsSchema = {
  body: z.object({
    userId: z.string().uuid({ message: "Invalid user ID format" })
  })
};

/**
 * Get latest AI insight validation
 */
export const getLatestInsightSchema = {
  query: z.object({
    userId: z.string().uuid({ message: "Invalid user ID format" })
  })
};
