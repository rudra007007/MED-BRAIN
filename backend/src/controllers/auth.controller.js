/**
 * Auth Controller
 * 
 * Handles user authentication including signup and login.
 * Uses JWT for session management.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/index.js';
import { createApiResponse } from '../utils/index.js';

/**
 * Generate JWT token
 * 
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'dev-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * User registration
 * 
 * POST /api/auth/signup
 * @param {Request} req - Express request with email, password, username
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json(
        createApiResponse({
          success: false,
          error: 'Email, password, and username are required',
        })
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json(
        createApiResponse({
          success: false,
          error:
            existingUser.email === email
              ? 'Email already registered'
              : 'Username already taken',
        })
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        onboardingCompleted: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json(
      createApiResponse({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            onboardingCompleted: user.onboardingCompleted,
          },
          token,
        },
      })
    );
  } catch (error) {
    console.error('[Auth Controller] Signup error:', error);
    res.status(500).json(
      createApiResponse({
        success: false,
        error: error.message || 'Registration failed',
      })
    );
  }
};

/**
 * User login
 * 
 * POST /api/auth/login
 * @param {Request} req - Express request with email and password
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(
        createApiResponse({
          success: false,
          error: 'Email and password are required',
        })
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json(
        createApiResponse({
          success: false,
          error: 'Invalid credentials',
        })
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json(
        createApiResponse({
          success: false,
          error: 'Account is deactivated',
        })
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(
        createApiResponse({
          success: false,
          error: 'Invalid credentials',
        })
      );
    }

    // Generate token
    const token = generateToken(user.id);

    res.json(
      createApiResponse({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            onboardingCompleted: user.onboardingCompleted,
          },
          token,
        },
      })
    );
  } catch (error) {
    console.error('[Auth Controller] Login error:', error);
    res.status(500).json(
      createApiResponse({
        success: false,
        error: error.message || 'Login failed',
      })
    );
  }
};

/**
 * Get current user
 * 
 * GET /api/auth/me
 * Requires JWT authentication
 * @param {Request} req - Express request with user in req.user
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        onboardingCompleted: true,
        preferences: true,
      },
    });

    if (!user) {
      return res.status(404).json(
        createApiResponse({
          success: false,
          error: 'User not found',
        })
      );
    }

    res.json(
      createApiResponse({
        success: true,
        data: { user },
      })
    );
  } catch (error) {
    console.error('[Auth Controller] Get me error:', error);
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to fetch user',
      })
    );
  }
};

/**
 * Logout user (client-side implementation)
 * 
 * POST /api/auth/logout
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const logout = async (req, res) => {
  try {
    res.json(
      createApiResponse({
        success: true,
        message: 'Logged out successfully',
      })
    );
  } catch (error) {
    console.error('[Auth Controller] Logout error:', error);
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Logout failed',
      })
    );
  }
};
