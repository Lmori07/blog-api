/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Custom Modules
 * */
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateUsername } from '@/utils';

/**
 * Models
 * */
import User from '@/models/user';

/**
 * Types
 * */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type userData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body as userData;

    try {
        const username = generateUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role,
        })

        // Generate an access token and refresh token for a new user.

        res.status(201).json({
            user:{
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            timestamp: new Date().toISOString(), //1:33:21
        });
    }
    catch (error) {
        res.status(500).json({
            code: 'Server Error',
            message: 'Internal Server Error',
            error: error
        });

        logger.error('Error creating new user', error);
    }
};

export default register;