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
import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res:Response) =>{
    try {
        const userId = req.params.userId;

        await User.deleteOne({ _id: userId });
        logger.info('User account has been deleted successfully', { userId });

        res.sendStatus(204);
    }


    catch (error) {
        res.status(500).json({
            code: 'Server Error',
            message: 'Internal Server Error',
            error: error,
        });

        logger.error('Error while getting a user, error msg is:', error);
    }
};

export default deleteUser;