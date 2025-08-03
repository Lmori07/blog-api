/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Modules
 * */
import dotenv from 'dotenv';
import * as process from 'node:process';

/**
 * Types
 * */
import ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV_DEV || 'development',
  NODE_ENV_LOCAL: process.env.NODE_ENV_LOCAL || 'local',
  WHITELIST_ORIGINS: ['http://localhost:3000'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL: ['joseomv07@gmail.com'],
  defaultResLimit: 10,
  defaultResOffset: 0,
};

export default config;
