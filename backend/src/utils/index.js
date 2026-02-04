/**
 * Utility Functions for MED-BRAIN Backend
 * 
 * Helper functions for common operations across the application.
 * Centralized here to avoid code duplication and ensure consistency.
 */

/**
 * Calculate sleep duration in hours from start and end times
 * Handles cross-midnight scenarios (e.g., sleepStart=23:00, sleepEnd=07:00)
 * 
 * @param {string} sleepStart - Sleep start time in HH:mm format
 * @param {string} sleepEnd - Sleep end time in HH:mm format
 * @returns {number|null} Sleep duration in hours, or null if invalid input
 */
export const calculateSleepDuration = (sleepStart, sleepEnd) => {
  if (!sleepStart || !sleepEnd) {
    return null;
  }

  const [startHour, startMin] = sleepStart.split(':').map(Number);
  const [endHour, endMin] = sleepEnd.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Handle cross-midnight: if end time is earlier than start time,
  // assume it refers to the next day
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours in minutes
  }

  const durationMinutes = endMinutes - startMinutes;
  return parseFloat((durationMinutes / 60).toFixed(2)); // Return in hours with 2 decimal places
};

/**
 * Calculate days since user registration
 * Used for determining cold-start phase
 * 
 * @param {Date} userCreatedAt - User creation timestamp
 * @returns {number} Days since registration
 */
export const calculateDaysSinceRegistration = (userCreatedAt) => {
  const now = new Date();
  const created = new Date(userCreatedAt);
  const diffTime = Math.abs(now - created);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Determine AI analysis phase based on data availability
 * Phase 0: <7 days (global priors only)
 * Phase 1: 7-29 days (blended model)
 * Phase 2: >=30 days (personalized model)
 * 
 * @param {number} daysOfData - Number of days with metrics data
 * @returns {number} Phase indicator (0, 1, or 2)
 */
export const determineAnalysisPhase = (daysOfData) => {
  if (daysOfData < 7) return 0;
  if (daysOfData < 30) return 1;
  return 2;
};

/**
 * Format date to YYYY-MM-DD string for database storage
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForDB = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Parse time string to Date object for database storage
 * Creates a dummy date to store just the time component
 * 
 * @param {string} timeString - Time in HH:mm format
 * @returns {Date} Date object with the time component
 */
export const parseTimeString = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Standard API response wrapper
 * Ensures consistent response structure across all endpoints
 * 
 * @param {Object} params - Response parameters
 * @param {boolean} params.success - Whether the operation succeeded
 * @param {any} params.data - Response data payload
 * @param {string|null} params.error - Error message if failed
 * @returns {Object} Standardized API response
 */
export const createApiResponse = ({ success, data = null, error = null }) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString()
});

/**
 * Calculate date range for history queries
 * 
 * @param {number} days - Number of days to include
 * @returns {{ startDate: Date, endDate: Date }} Date range
 */
export const getDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
};

/**
 * Validate UUID format
 * Simple check without full UUID parsing
 * 
 * @param {string} str - String to validate
 * @returns {boolean} Whether the string is a valid UUID
 */
export const isValidUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};
