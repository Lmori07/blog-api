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
    WHITELIST_ORIGINS:['http://localhost:3000'] //mim 40:21 video
}

export default config;