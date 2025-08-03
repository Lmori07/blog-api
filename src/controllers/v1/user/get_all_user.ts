/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Custom Modules
 * */
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 * */
import User from '@/models/user';

/**
 * Types
 * */
import type { Request, Response } from 'express';

const getAllUser = async (req: Request, res:Response) =>{
    try {
        const limit = req.query.limit as string || config.defaultResLimit;
        const offset = req.query.offset as string || config.defaultResOffset;
        const total = await User.countDocuments();

        const users = await User.find()
            .select('-__v')
            .limit(Number(limit))
            .skip(Number(offset))
            .lean()
            .exec();

            res.status(200).json({
                users,
                total,
                offset,
                limit,
            })
    }


    catch (error) {
        res.status(500).json({
            code: 'Server Error',
            message: 'Internal Server Error',
            error: error,
        });

        logger.error('Error while getting all users, error msg is:', error);
    }
};

export default getAllUser;