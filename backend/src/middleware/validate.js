/**
 * Validation Middleware
 * 
 * Generic middleware for Zod schema validation.
 * Extracts and validates request data, returning clear error messages.
 */

import { createApiResponse } from '../utils/index.js';

/**
 * Validate request against a Zod schema
 * 
 * @param {Object} schema - Zod schema with body/query properties
 * @returns {Function} Express middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body if schema has body property
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json(
            createApiResponse({
              success: false,
              error: 'Invalid request body',
              details: result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
              })),
            })
          );
        }
        req.validatedBody = result.data;
      }

      // Validate query parameters if schema has query property
      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json(
            createApiResponse({
              success: false,
              error: 'Invalid query parameters',
              details: result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
              })),
            })
          );
        }
        req.validatedQuery = result.data;
      }

      // Continue to next middleware/controller
      next();

    } catch (error) {
      console.error('[Validation] Unexpected error:', error);
      return res.status(500).json(
        createApiResponse({
          success: false,
          error: 'Validation failed',
        })
      );
    }
  };
};

/**
 * Async wrapper for route handlers
 * Catches errors and passes them to error handler
 * 
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 * Catches all errors and returns consistent error responses
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json(
      createApiResponse({
        success: false,
        error: 'A record with this data already exists',
      })
    );
  }

  if (err.code === 'P2025') {
    return res.status(404).json(
      createApiResponse({
        success: false,
        error: 'Record not found',
      })
    );
  }

  // Default error response
  res.status(err.status || 500).json(
    createApiResponse({
      success: false,
      error: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    })
  );
};
