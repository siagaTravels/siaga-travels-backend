import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

// Validate required environment variables
if (!config.databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
}

export default config;
