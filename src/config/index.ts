/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Modules
 * */
import dotenv from 'dotenv';
import * as process from "node:process";

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV_DEV || 'development',
    NODE_ENV_LOCAL: process.env.NODE_ENV_LOCAL || 'local',
    WHITELIST_ORIGINS:['http://localhost:3000'],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}

export default config;