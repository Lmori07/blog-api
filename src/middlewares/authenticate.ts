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
import { verifyAccessToken } from '@/lib/jwt';

/**
 * Types
 * */
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

/**
 * @function authenticate
 * @description Middleware to verify the user's access token from the Authorization header.
 *              If the token is valid, the user's ID is attached to the request object.
 *              Otherwise, it returns an appropriate error response.
 *
 * @param {Request} req - Express request object. Expects a bearer token in the Authorization
 * header.
 * @param {Response} res - Express response object used to send error responses if
 * authentication fails.
 * @param {NextFunction} next - Express next function to pass control to the next middleware.
 *
 * @return {void}
 * */
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // If there's no Bearer token, respond with 401 Unauthorized.
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'Authentication Error',
      message: 'Access denied, no bearer token provided',
    });
  }

  // Split out the token from the 'Bearer' prefix.
  const [_, token] = authHeader.split(' ');

  try {
    // Verify the token and extract the userId from the payload.
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach the userId to the request object for later use.
    req.userId = jwtPayload.userId;

    // Proceed to the next middleware for later use.
    return next();
  } catch (error) {
    // Handle expired token error.
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        code: 'Authentication Error',
        message: 'Access token expired, please login again',
        error,
      });
    }

    // Handle invalid token error.
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: 'Authentication Error',
        message: 'Invalid access token',
        error,
      });
    }

    // Catch-all for other errors.
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server Error',
      error: error,
    });
    logger.error('Error while authenticating user, error msg is:', error);
  }
};

export default authenticate;
