/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Custom Module
 * */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 * */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 * */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type userData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as userData;

    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      return res.status(404).json({
        code: 'Not Found',
        message: 'User not found',
      });
    }

    // Generate an access token and refresh token for a new user.
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in db.
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      timestamp: new Date().toISOString(),
    });

    logger.info('User registered successfully', user);
  } catch (error) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error creating new user the error msg is:', error);
  }
};

export default login;
