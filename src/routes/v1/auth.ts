/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Module*/
import { Router } from 'express';
import { body } from 'express-validator'

/**
 * Controller
 * */
import register from '@/controllers/v1/auth/register';

/**
 * Middlewares
 * */
import validationError from "@/middlewares/validationError";

/**
 * Models
 * */
import User from '@/models/user';

const router = Router();

router.post('/register',
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be at least 50 characters long')
        .isEmail()
        .withMessage('Email must be a valid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if(userExists) {
                throw new Error('User email or password is invalid');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isString()
        .withMessage('Role format is invalid')
        .isIn(['admin', 'user'])
        .withMessage('Role enter is invalid'),
    validationError,
    register
);

export default router;

