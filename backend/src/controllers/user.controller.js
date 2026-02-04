/**
 * User Controller
 * 
 * Handles user-related operations including creation and validation.
 * Supports anonymous users for privacy-first design.
 */

import prisma from '../prisma/index.js';
import { createApiResponse } from '../utils/index.js';

/**
 * Create a new anonymous user
 * 
 * POST /api/user
 * No input body required - user creation is automatic
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const createUser = async (req, res) => {
  try {
    // Create new anonymous user
    const user = await prisma.user.create({
      data: {},
      select: {
        id: true,
        createdAt: true,
      },
    });

    console.log(`[User Controller] Created new user: ${user.id}`);

    res.status(201).json(
      createApiResponse({
        success: true,
        data: {
          user_id: user.id,
          created_at: user.createdAt,
        },
      })
    );

  } catch (error) {
    console.error('[User Controller] Error creating user:', error);
    
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to create user. Please try again.',
      })
    );
  }
};

/**
 * Get user by ID
 * Useful for validating user existence
 * 
 * GET /api/user/:id
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        _count: {
          select: {
            dailyMetrics: true,
            aiInsights: true,
          },
        },
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
        data: {
          user_id: user.id,
          created_at: user.createdAt,
          metrics_count: user._count.dailyMetrics,
          insights_count: user._count.aiInsights,
        },
      })
    );

  } catch (error) {
    console.error('[User Controller] Error fetching user:', error);
    
    res.status(500).json(
      createApiResponse({
        success: false,
        error: 'Failed to fetch user',
      })
    );
  }
};
