/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Module
 * */
import mongoose from 'mongoose';

/**
 * Custom Modules
 * */
import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * Types
 * */
import type { ConnectOptions} from "mongoose";

/**
 * Client Option
 * */
const clientOptions: ConnectOptions = {
    dbName: 'blog-db',
    appName: 'Blog API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};

/**
 * Establish a connection to the MongoDB database using Mongoose.
 * If an error occurs during the connection process, it throws an error with
 * a descriptive message.
 *
 * - Uses `MONGO_URI` as the connection string.
 * - `clientOptions` contains additional configuration for Mongoose.
 * - Errors are properly handled and rethrown for better debugging.
 * */
export const connectToDatabase = async () => {
    if(!config.MONGO_URI){
        throw new Error('MongoDB URI is not defined in the config.env file');
    }
    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info('MongoDB connected.',{
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    }
    catch (error) {
        if(error instanceof Error){
            throw error;
        }

        console.error('Error connecting to MongoDB:', error);
    }
};

/**
 * Disconnects from the MongoDB database using Mongoose.
 *
 * This function attempts to disconnect from the database asynchronously.
 * If the disconnection is successful, a success message is logged.
 * If an error occurs, it is either re-thrown as a new Error (if it's an instance of Error)
 * or logged to the console.
 * */
export const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected.', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    }
    catch (error) {
        if(error instanceof Error){
            throw new Error(error.message);
        }
        logger.error('Error disconnecting from MongoDB:', error);
    }
}