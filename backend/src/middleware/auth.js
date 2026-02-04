/**
 * Auth Middleware
 * 
 * JWT token verification and user authentication.
 */

import jwt from 'jsonwebtoken';

/**
 * Verify JWT token and attach user to request
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
export const protect = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret-key'
    );

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Token verification error:', error.message);
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
};
