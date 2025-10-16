import dotenv from 'dotenv';
dotenv.config();


export default {
    PORT: process.env.PORT || '4000',
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d', 
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    COOKIE_NAME: process.env.COOKIE_NAME || 'autoparts_token'
};