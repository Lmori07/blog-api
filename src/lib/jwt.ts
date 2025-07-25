/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Generate Token
 * node > const crypto = require('crypto') > crypto.randomBytes(1).toString('hex') */

/**
 * Node modules
 * */
import jwt from 'jsonwebtoken';

/**
 * Custom Modules
 * */
import config from '@/config';

/**
 * Types
 * */
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
