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

const getUser = async (req: Request, res:Response) =>{
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select('-__v').exec();

        if(!user){
            return res.status(404).json({
                code: 'Not Found',
                message: 'User not found',
            });
        }

        res.status(200).json({
            user,
        });
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

export default getUser;