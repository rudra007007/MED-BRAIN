/**
 * Metrics Controller
 * 
 * Handles daily health metrics ingestion and querying.
 * Manages:
 * - Daily metric creation with sleep duration calculation
 * - Duplicate prevention per date per user
 * - History retrieval for charts
 */

import prisma from '../prisma/index.js';
import { createApiResponse, calculateSleepDuration, formatDateForDB } from '../utils/index.js';

/**
 * Create or update daily metrics for a user
 * 
 * POST /api/metrics/daily
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const createOrUpdateDailyMetric = async (req, res) => {
  try {
    const { userId, date, sleepStart, sleepEnd, screenTime, activityMinutes } = req.body;

    // Verify user exists before creating metrics
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json(
        createApiResponse({
          success: false,
          error: 'User not found. Please create a user first.',
        })
      );
    }

    // Calculate sleep duration (handles cross-midnight scenarios)
    const sleepDuration = calculateSleepDuration(sleepStart, sleepEnd);

    // Format date for database
    const metricDate = new Date(date);

    // Upsert: create if doesn't exist, update if exists (prevent duplicates)
    const metric = await prisma.dailyMetric.upsert({
      where: {
        userId_date: {
          userId,
          date: metricDate,
        },
      },
      update: {
        sleepStart: sleepStart ? new Date(`1970-01-01T${sleepStart}:00`) : null,
        sleepEnd: sleepEnd ? new Date(`1970-01-01T${sleepEnd}:00`) : null,
        sleepDuration,
        screenTime,
        activityMinutes,
      },
      create: {
        userId,
        date: metricDate,
        sleepStart: sleepStart ? new Date(`1970-01-01T${sleepStart}:00`) : null,
        sleepEnd: sleepEnd ? new Date(`1970-01-01T${sleepEnd}:00`) : null,
        sleepDuration,
        screenTime,
        activityMinutes,
      },
    });

    console.log(`[Metrics Controller] ${metric.createdAt === metric.updatedAt ? 'Created' : 'Updated'} daily metric for user ${userId} on ${formatDateForDB(date)}`);

    res.status(metric.createdAt === metric.updatedAt ? 201 : 200).json(
      createApiResponse({
        success: true,
        data: {
          id: metric.id,
          user_id: metric.userId,
          date: formatDateForDB(metric.date),
          sleep_duration: metric.sleepDuration,
          screen_time: metric.screenTime,
          activity_minutes: metric.activityMinutes,
          is_new_entry: metric.createdAt === metric.updatedAt,
        },
      })
    );

  } catch (error) {
    console.error('[Metrics Controller] Error creating/updating metric:', error);
    
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to save metrics. Please try again.',
      })
    );
  }
};

/**
 * Get daily metrics history for a user
 * 
 * GET /api/metrics/history?userId=xxx&days=30
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const getMetricsHistory = async (req, res) => {
  try {
    const { userId, days } = req.query;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json(
        createApiResponse({
          success: false,
          error: 'User not found',
        })
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch metrics within date range
    const metrics = await prisma.dailyMetric.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc', // Oldest first for chart data
      },
      select: {
        id: true,
        date: true,
        sleepDuration: true,
        screenTime: true,
        activityMinutes: true,
        sleepStart: true,
        sleepEnd: true,
      },
    });

    // Format response for frontend charts
    const formattedMetrics = metrics.map((metric) => ({
      id: metric.id,
      date: formatDateForDB(metric.date),
      sleep_duration: metric.sleepDuration,
      screen_time: metric.screenTime,
      activity_minutes: metric.activityMinutes,
      sleep_start: metric.sleepStart ? metric.sleepStart.toTimeString().slice(0, 5) : null,
      sleep_end: metric.sleepEnd ? metric.sleepEnd.toTimeString().slice(0, 5) : null,
    }));

    console.log(`[Metrics Controller] Retrieved ${metrics.length} days of history for user ${userId}`);

    res.json(
      createApiResponse({
        success: true,
        data: {
          user_id: userId,
          days_requested: days,
          days_returned: metrics.length,
          metrics: formattedMetrics,
        },
      })
    );

  } catch (error) {
    console.error('[Metrics Controller] Error fetching metrics history:', error);
    
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to retrieve metrics history',
      })
    );
  }
};

/**
 * Get the latest metrics entry for a user
 * Useful for displaying today's metrics
 * 
 * GET /api/metrics/latest?userId=xxx
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const getLatestMetric = async (req, res) => {
  try {
    const { userId } = req.query;

    const metric = await prisma.dailyMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        sleepDuration: true,
        screenTime: true,
        activityMinutes: true,
      },
    });

    if (!metric) {
      return res.status(404).json(
        createApiResponse({
          success: false,
          error: 'No metrics found for this user',
        })
      );
    }

    res.json(
      createApiResponse({
        success: true,
        data: {
          id: metric.id,
          date: formatDateForDB(metric.date),
          sleep_duration: metric.sleepDuration,
          screen_time: metric.screenTime,
          activity_minutes: metric.activityMinutes,
        },
      })
    );

  } catch (error) {
    console.error('[Metrics Controller] Error fetching latest metric:', error);
    
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to retrieve latest metric',
      })
    );
  }
};
