import 'dotenv/config';
import { prisma, connectDB, disconnectDB } from '../src/config/db';

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file!');
    process.exit(1);
}

const sampleDestinations = [
    {
        slug: 'sigiriya-rock-fortress',
        name: 'Sigiriya Rock Fortress',
        subtitle: 'The Eighth Wonder of the World',
        description: 'Ancient rock fortress with stunning frescoes and landscaped gardens',
        longDescription: 'Sigiriya, also known as the Lion Rock, is an ancient rock fortress located in the northern Matale District.',
        location: 'Sigiriya, Matale District',
        province: 'Central Province',
        image: 'https://example.com/sigiriya.jpg',
        gallery: ['https://example.com/sigiriya-1.jpg'],
        rating: 4.8,
        reviews: BigInt(2450),
        bestSeason: ['December', 'January', 'February', 'March'],
        category: 'Historical',
        difficulty: 'Moderate',
        distanceFromColombo: '169 km',
        duration: '3-4 hours',
        gradient: 'from-amber-500 to-orange-600',
        highlights: ['Ancient frescoes', 'Mirror Wall', 'Lion Gate entrance'],
        whyVisit: ['UNESCO World Heritage Site', 'Stunning views'],
        tips: ['Start early to avoid crowds', 'Wear comfortable shoes'],
        nearbyPlaces: ['Dambulla Cave Temple', 'Pidurangala Rock'],
        popularity: BigInt(95),
        price: '$30 USD',
        travelTimeFromColombo: '4 hours',
    },
    {
        slug: 'galle-fort',
        name: 'Galle Fort',
        subtitle: 'Colonial Heritage by the Sea',
        description: 'Historic Dutch fort with charming streets and ocean views',
        location: 'Galle',
        province: 'Southern Province',
        image: 'https://example.com/galle-fort.jpg',
        gallery: ['https://example.com/galle-1.jpg'],
        rating: 4.6,
        reviews: BigInt(1890),
        bestSeason: ['November', 'December', 'January', 'February'],
        category: 'Historical',
        difficulty: 'Easy',
        distanceFromColombo: '126 km',
        duration: '2-3 hours',
        gradient: 'from-blue-500 to-teal-600',
        highlights: ['Dutch Reformed Church', 'Lighthouse', 'Maritime Museum'],
        whyVisit: ['UNESCO World Heritage Site', 'Beautiful architecture'],
        tips: ['Best visited in late afternoon', 'Explore side streets'],
        nearbyPlaces: ['Unawatuna Beach', 'Mirissa'],
        popularity: BigInt(88),
        price: 'Free',
        travelTimeFromColombo: '2.5 hours',
    },
];

async function main() {
    console.log('🔌 Connecting to database...\n');
    await connectDB();

    console.log('🌱 Starting database seed...\n');

    for (const destination of sampleDestinations) {
        const result = await prisma.destination.upsert({
            where: { slug: destination.slug },
            update: destination,
            create: destination,
        });
        console.log(`✅ Upserted: ${result.name} (${result.slug})`);
    }

    console.log('\n🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await disconnectDB();
    });
