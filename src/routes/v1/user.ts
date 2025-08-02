/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Module
 * */
import { Router } from 'express';
import { body } from 'express-validator';

/**
 * Middlewares
 * */
import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";

/**
 * Controllers
 * */
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";

/**
 * Models
 * */
import User from '@/models/user';



const router = Router();

//#region Get current user
router.get('/current',
    authenticate,
    authorize(['admin','user']),
    getCurrentUser,
);
//#endregion

//#region Update current user
router.put('/current',
    authenticate,
    authorize(['admin','user']),
    body('username')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Username must be at least 20 characters long')
        .custom(async (value) => {
            const userExists = await User.exists({ username: value });
            if (userExists) {
                throw new Error('Username is already taken');
            }
        }),
    body('email')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Email must be at least 50 characters long')
        .isEmail()
        .withMessage('Must be a valid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error('Username is already taken');
            }
        }),
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('first_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('First name must be at least 20 characters long'),
    body('last_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Last name must be at least 20 characters long'),
    body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
        .optional()
        .isURL()
        .withMessage('Invalid URL')
        .isLength({ max: 100 })
        .withMessage('URL must be at least 100 characters long'),
    validationError,
    updateCurrentUser,
);
//#endregion

//#region Delete current user
router.delete('/current',
    authenticate,
    authorize(['admin','user']),
    deleteCurrentUser,
)
//#endregion
export default router;