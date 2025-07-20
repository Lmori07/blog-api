/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Module
 * */
import { validationResult } from 'express-validator';

/**
 * Types
 * */
import type { Request, Response, NextFunction } from 'express';

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 'Validation Error',
      errors: errors.mapped(),
    });
  }

  next();
};

export default validationError;
