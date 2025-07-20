/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Custom Modules
 * */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateUsername } from '@/utils';

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

type userData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body as userData;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    logger.warn(
      `User with email ${email} tried to register as an admin but is not in the whitelist`,
    );
    //return;
    return res.status(403).json({
      code: 'Authorization Error',
      message: 'You cannot register as an admin',
    });
  }

  try {
    const username = generateUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate an access token and refresh token for a new user.
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in db.
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
      timestamp: new Date().toISOString(),
    });

    logger.info('User registered successfully', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error creating new user the error msg is:', error);
  }
};

export default register;
