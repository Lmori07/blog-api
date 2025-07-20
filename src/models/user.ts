/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Node Module
 * */
import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user',
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        linkedIn?: string;
        x?: string;
        youtube?: string;
    }
}

/**
 * User schema
 * */
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxlength: [20, 'Username must be at least 20 characters long'],
            unique: [true, 'Username must be unique'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxlength: [50, 'Email must be at least 50 characters long'],
            unique: [true, 'Email must be unique'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values:['admin', 'user'],
                message: '{VALUE} is not supported.}',
            },
            default: 'user',
        },
        firstName: {
            type: String,
            maxlength: [20, 'First name must be at least 20 characters long'],
        },
        lastName: {
            type: String,
            maxlength: [20, 'Last name must be at least 20 characters long'],
        },
        socialLinks: {
            website: {
                type: String,
                maxlength: [100, 'Website must be at least 100 characters long'],
            },
            facebook: {
                type: String,
                maxlength: [100, 'Facebook profile url must be at least 100 characters long'],
            },
            instagram: {
                type: String,
                maxlength: [100, 'Instagram profile url must be at least 100 characters long'],
            },
            linkedIn: {
                type: String,
                maxlength: [100, 'LinkedIn profile url must be at least 100 characters long'],
            },
            x: {
                type: String,
                maxlength: [100, 'X profile url must be at least 100 characters long'],
            },
            youtube: {
                type: String,
                maxlength: [100, 'Youtube channel url must be at least 100 characters long'],
            },
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next){
    if (!this.isModified('password')){
        next();
        return;
    }

    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default model<IUser>('User', userSchema);