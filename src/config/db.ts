import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Validate DATABASE_URL at startup
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

// Create a singleton instance of the Prisma client
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

/**
 * Connect to the database
 * Call this before starting the server
 */
export async function connectDB(): Promise<void> {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

/**
 * Disconnect from the database
 * Call this during graceful shutdown
 */
export async function disconnectDB(): Promise<void> {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
}

export default prisma;
