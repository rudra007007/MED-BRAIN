/**
 * AI Controller
 * 
 * Orchestrates AI analysis workflow:
 * 1. Fetches user's historical metrics
 * 2. Sends data to Python AI service
 * 3. Stores AI insights with confidence scores
 * 4. Returns personalized suggestions to frontend
 * 
 * Handles cold-start logic by passing appropriate data to AI service.
 */

import prisma from '../prisma/index.js';
import { createApiResponse, formatDateForDB, determineAnalysisPhase } from '../utils/index.js';
import { analyzeUserMetrics, getPhaseDescription, getConfidenceLevel } from '../services/ai.service.js';

/**
 * Analyze user metrics and generate AI insights
 * 
 * POST /api/ai/analyze
 * 
 * This endpoint:
 * 1. Fetches last 30 days of metrics for the user
 * 2. Sends structured data to Python AI service
 * 3. Stores AIInsight in database
 * 4. Returns AI output to frontend
 * 
 * Cold-start handling:
 * - Phase 0 (<7 days): Passes limited data to AI, AI uses global priors
 * - Phase 1 (7-29 days): Passes growing dataset, AI blends models
 * - Phase 2 (>=30 days): Full personalized analysis available
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const analyzeMetrics = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { userId } = req.body;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json(
        createApiResponse({
          success: false,
          error: 'User not found',
        })
      );
    }

    // Fetch last 30 days of metrics for AI analysis
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const metrics = await prisma.dailyMetric.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Determine phase based on available data
    // This helps frontend communicate uncertainty to user
    const daysOfData = metrics.length;
    const estimatedPhase = determineAnalysisPhase(daysOfData);

    console.log(`[AI Controller] Analyzing ${daysOfData} days of data for user ${userId} (estimated phase: ${estimatedPhase})`);

    // Send to AI service for analysis
    const aiResult = await analyzeUserMetrics({
      userId,
      metrics,
    });

    // AI service returns phase, confidence, suggestions, and stats
    const { phase, confidence, suggestions, stats } = aiResult.data;

    // Store AI insight in database
    const insight = await prisma.aIInsight.create({
      data: {
        userId,
        date: endDate,
        phase,
        confidence,
        suggestions,
        stats,
      },
    });

    const duration = Date.now() - startTime;

    console.log(`[AI Controller] Analysis complete for user ${userId}: phase=${phase}, confidence=${confidence}, duration=${duration}ms`);

    // Return response to frontend
    res.json(
      createApiResponse({
        success: true,
        data: {
          insight_id: insight.id,
          date: formatDateForDB(insight.date),
          phase,
          phase_description: getPhaseDescription(phase),
          confidence,
          confidence_level: getConfidenceLevel(confidence),
          suggestions,
          stats,
          analysis_duration_ms: duration,
        },
      })
    );

  } catch (error) {
    console.error('[AI Controller] Analysis failed:', error);
    
    res.status(error.message.includes('unavailable') ? 503 : 500).json(
      createApiResponse({
        success: false,
        error: error.message || 'AI analysis failed. Please try again.',
      })
    );
  }
};

/**
 * Get the most recent AI insight for a user
 * 
 * GET /api/ai/latest?userId=xxx
 * 
 * Used by frontend's daily personalized suggestions screen.
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const getLatestInsight = async (req, res) => {
  try {
    const { userId } = req.query;

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

    // Fetch latest AI insight
    const insight = await prisma.aIInsight.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (!insight) {
      return res.status(404).json(
        createApiResponse({
          success: false,
          error: 'No AI insights available yet. Please submit daily metrics first.',
        })
      );
    }

    // Return formatted insight
    res.json(
      createApiResponse({
        success: true,
        data: {
          insight_id: insight.id,
          date: formatDateForDB(insight.date),
          phase: insight.phase,
          phase_description: getPhaseDescription(insight.phase),
          confidence: insight.confidence,
          confidence_level: getConfidenceLevel(insight.confidence),
          suggestions: insight.suggestions,
          stats: insight.stats,
        },
      })
    );

  } catch (error) {
    console.error('[AI Controller] Error fetching latest insight:', error);
    
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to retrieve AI insights',
      })
    );
  }
};

/**
 * Get AI insight history for a user
 * 
 * GET /api/ai/history?userId=xxx&days=30
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const getInsightHistory = async (req, res) => {
  try {
    const { userId, days } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days, 10));

    // Fetch insights within date range
    const insights = await prisma.aIInsight.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    const formattedInsights = insights.map((insight) => ({
      id: insight.id,
      date: formatDateForDB(insight.date),
      phase: insight.phase,
      confidence: insight.confidence,
      suggestions_count: insight.suggestions.length,
    }));

    res.json(
      createApiResponse({
        success: true,
        data: {
          user_id: userId,
          insights: formattedInsights,
        },
      })
    );

  } catch (error) {
    console.error('[AI Controller] Error fetching insight history:', error);
    
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to retrieve insight history',
      })
    );
  }
};
