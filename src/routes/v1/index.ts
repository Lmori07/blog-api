/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Nodule Modules
 * */
import Router, { Request, Response } from 'express';
const router = Router();

/**
 * Routes
 * */
import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';

/**
 * Root route
 * */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'API is alive',
    status: 'ok',
    version: '1.0.0',
    docs: 'https//localhost:3000/',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
