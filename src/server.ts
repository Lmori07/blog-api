/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
* Import Express, Cors, cookieParser, compression, helmet
* */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
*Custom Modules */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

/**
 * Router
 * */
import v1Routes from "@/routes/v1";

/**
 * Types*/
import type { CorsOptions} from "cors";
import * as process from "node:process";

/**
*Express app initialization and port initialization
 * */
const app = express();

//Configure CORS options config.env will let you know which environment is active.
const corsOptions: CorsOptions = {
  origin(origin,callback){
    if(config.NODE_ENV_LOCAL === 'local' || !origin || config.WHITELIST_ORIGINS.includes(origin)){
      callback(null,true);
    }else{
      //Reject request from non-allowlisted origins
      callback(new Error(`CORS error: ${origin} is not allowed by CORS`),false,
      );
      logger.warn(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

//Apply CORS middleware
app.use(cors(corsOptions));

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// `extended: true` allows rich objects and arrays via a query string library
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
    compression({
      threshold: 1024, // Only compress responses larger than 1 KB
    })
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive request and enhance security
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server:
 * - Tries to connect to the database before initializing the server.
 * - Defines the API route (`/api/v1`)=> http://localhost:3000/api/v1 Env. Variable in Postman.
 * - Starts the server on the specified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process
 * exits with status 1.*/

(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}/api/v1`);
    });

  }
  catch (error) {
    logger.error('Failed to start server',error);

    if(config.NODE_ENV === 'production'){
    process.exit(1);
    }
  }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code `0` (indicating a successful shutdown).*/
/*
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Shutting down server...');
    process.exit(0);
  }
  catch(error) {
   logger.error('Error during server shutdown',error);
  }
};*/

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`).
 * - `SIGTERM` is typically sent when stopping a process
 *(e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process
 * (e.g., pressing `Ctrl +C).
 * - When either signal is received, `handleServerShutdown` is executed
 * to ensure proper cleanup.*/

//process.on(`SIGTERM`, handleServerShutdown)

