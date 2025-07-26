/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Module
 * */
import * as express from 'express';

/**
 * Types
 * */
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
