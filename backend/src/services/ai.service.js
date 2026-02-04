/**
 * AI Integration Service
 * 
 * Orchestrates communication between Node.js backend and Python AI service.
 * This service:
 * - Formats metrics data for the AI API
 * - Handles network communication with the AI service
 * - Manages timeout and error handling
 * - NEVER runs ML logic or modifies AI behavior
 * 
 * The AI service is responsible for:
 * - Phase determination (cold-start logic)
 * - Confidence scoring
 * - Generating personalized suggestions
 * - Statistical analysis
 */

import axios from 'axios';

/**
 * AI Service Configuration
 * Centralized configuration for AI service connection
 */
const aiConfig = {
  baseUrl: process.env.AI_SERVICE_URL || 'http://localhost:8001',
  endpoint: '/analyze',
  timeout: parseInt(process.env.AI_SERVICE_TIMEOUT || '30000', 10),
};

/**
 * Build the full AI service URL
 * @returns {string} Complete URL for AI analysis endpoint
 */
const getAiServiceUrl = () => {
  return `${aiConfig.baseUrl}${aiConfig.endpoint}`;
};

/**
 * Transform raw database metrics into AI service format
 * 
 * The AI service expects a specific structure:
 * {
 *   user_id: string,
 *   metrics: [{
 *     date: "YYYY-MM-DD",
 *     sleep_duration: float,
 *     screen_time: float,
 *     activity_minutes: int
 *   }]
 * }
 * 
 * @param {Array} rawMetrics - Raw metrics from database
 * @param {string} userId - User UUID
 * @returns {Object} Formatted payload for AI service
 */
export const formatMetricsForAI = (rawMetrics, userId) => {
  // Sort metrics by date ascending (oldest first) for proper time-series analysis
  const sortedMetrics = [...rawMetrics].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return {
    user_id: userId,
    metrics: sortedMetrics.map((metric) => ({
      date: metric.date instanceof Date 
        ? metric.date.toISOString().split('T')[0] 
        : metric.date,
      sleep_duration: metric.sleepDuration || 0,
      screen_time: metric.screenTime || 0,
      activity_minutes: metric.activityMinutes || 0,
    })),
  };
};

/**
 * Send metrics to AI service for analysis
 * 
 * @param {Object} params - Analysis parameters
 * @param {string} params.userId - User UUID
 * @param {Array} params.metrics - User's daily metrics
 * @returns {Promise<Object>} AI analysis result
 * @throws {Error} If AI service is unavailable or returns error
 */
export const analyzeUserMetrics = async ({ userId, metrics }) => {
  const startTime = Date.now();
  
  try {
    // Validate we have enough data for meaningful analysis
    if (!metrics || metrics.length === 0) {
      throw new Error('No metrics provided for analysis');
    }

    // Build payload for AI service
    const payload = formatMetricsForAI(metrics, userId);
    
    console.log(`[AI Service] Sending ${metrics.length} days of metrics for user ${userId}`);
    console.log(`[AI Service] URL: ${getAiServiceUrl()}`);

    // Make HTTP request to AI service
    const response = await axios.post(
      getAiServiceUrl(),
      payload,
      {
        timeout: aiConfig.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    const duration = Date.now() - startTime;
    console.log(`[AI Service] Analysis completed in ${duration}ms`);

    // Validate response structure
    if (!response.data) {
      throw new Error('AI service returned empty response');
    }

    // The AI service should return:
    // {
    //   phase: number,
    //   confidence: number,
    //   suggestions: string[],
    //   stats: object
    // }
    
    return {
      success: true,
      data: response.data,
      duration,
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Handle different error types
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        console.error(`[AI Service] Connection refused to ${getAiServiceUrl()}`);
        throw new Error('AI service is currently unavailable. Please try again later.');
      }
      
      if (error.response) {
        // AI service returned an error response
        console.error(`[AI Service] Error response: ${error.response.status}`, error.response.data);
        throw new Error(`AI service error: ${error.response.data?.message || error.response.statusText}`);
      }
      
      if (error.request) {
        // Request was made but no response received
        console.error('[AI Service] No response received');
        throw new Error('AI service did not respond. Please try again.');
      }
    }
    
    // Re-throw with context
    console.error(`[AI Service] Analysis failed after ${duration}ms:`, error.message);
    throw new Error(`Analysis failed: ${error.message}`);
  }
};

/**
 * Check if AI service is healthy and responsive
 * Useful for health checks and monitoring
 * 
 * @returns {Promise<boolean>} Whether AI service is available
 */
export const checkAiServiceHealth = async () => {
  try {
    const response = await axios.get(
      `${aiConfig.baseUrl}/health`,
      { timeout: 5000 }
    );
    return response.status === 200;
  } catch (error) {
    console.warn('[AI Service] Health check failed:', error.message);
    return false;
  }
};

/**
 * Get phase description for frontend display
 * 
 * @param {number} phase - AI analysis phase
 * @returns {string} Human-readable phase description
 */
export const getPhaseDescription = (phase) => {
  const descriptions = {
    0: 'Building your personalized profile based on general health patterns.',
    1: 'Refining recommendations as we learn more about your habits.',
    2: 'Highly personalized insights based on your unique patterns.',
  };
  return descriptions[phase] || 'Unknown phase';
};

/**
 * Calculate confidence level for display
 * 
 * @param {number} confidence - AI confidence score (0-1)
 * @returns {string} Human-readable confidence level
 */
export const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
};
