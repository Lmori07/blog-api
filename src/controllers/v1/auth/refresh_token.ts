/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Module
 * */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom Modules
 * */
import { logger } from '@/lib/winston';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

/**
 * Models
 * */
import Token from '@/models/token';

/**
 * Types
 * */
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExits = await Token.exists({ token: refreshToken });

    if (!tokenExits) {
      return res.status(401).json({
        code: 'Authentication Error',
        message: 'Invalid refresh token',
      });
    }

    // Verify refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      accessToken,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        code: 'Authentication Error',
        message: 'Refresh token expired, please login again',
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: 'Authentication Error',
        message: 'Invalid refresh token',
      });
    }

    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error while refreshing toke, error msg is:', error);
  }
};

export default refreshToken;
