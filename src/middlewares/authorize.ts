/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Custom Modules
 * */
import { logger } from '@/lib/winston';

/**
 * Models
 * */
import User from '@/models/user';

/**
 * Types
 * */
import type { Request, Response, NextFunction } from 'express';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;

        try {
            const user = await User.findById(userId).select('role').exec();

            if (!user) {
                return res.status(404).json({
                    code: 'Authentication Error',
                    message: 'User not found',
                });
            }

            if(!roles.includes(user.role)){
                return res.status(403).json({
                    code: 'Authorization Error',
                    message: 'You are not authorized to perform this action',
                });
            }

            return next();
        } catch (error) {
            res.status(500).json({
                code: 'Server Error',
                message: 'Internal Server Error',
                error: error,
            });

            logger.error('Error while authorizing user, error msg is:', error);
        }
    }
}

export default authorize;