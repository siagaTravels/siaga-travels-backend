import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Simple script to test database connection.
 * Run with: npm run test:db
 */
async function testConnection() {
    console.log('🔌 Testing database connection...\n');

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not set in .env file!');
        console.log('\nPlease create a .env file with:');
        console.log('DATABASE_URL="postgresql://user:password@host:port/database"');
        process.exit(1);
    }

    console.log('📍 Database URL found (masked):');
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^@]+)@/, ':****@');
    console.log(`   ${maskedUrl}\n`);

    const prisma = new PrismaClient();

    try {
        // Test connection
        await prisma.$connect();
        console.log('✅ Successfully connected to database!\n');

        // Test query - count destinations
        const count = await prisma.destination.count();
        console.log(`📊 Current destinations in database: ${count}`);

        // Show first destination if any
        if (count > 0) {
            const first = await prisma.destination.findFirst();
            console.log(`   First destination: ${first?.name ?? 'Unknown'}`);
        }

        console.log('\n✅ All database tests passed!');
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
