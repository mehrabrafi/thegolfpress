import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const subtagsByCat: Record<string, string[]> = {
    'How-To': ['Swing Sequence', 'Putting', 'Short Game', 'Driving', 'Beginners', 'Mental Game', 'Fitness'],
    'Courses': ['Scotland', 'England', 'Portugal', 'Spain', 'United Kingdom', 'Florida', 'California', 'New York', 'Texas']
};

async function main() {
    console.log('Seeding sub-tags...');
    for (const [catName, tags] of Object.entries(subtagsByCat)) {
        const cat = await prisma.category.findUnique({
            where: { name: catName }
        });

        if (!cat) {
            console.log(`Category ${catName} not found, skipping.`);
            continue;
        }

        for (const tagName of tags) {
            await prisma.subTag.create({
                data: {
                    name: tagName,
                    categoryId: cat.id
                }
            });
            console.log(`- Added ${tagName} to ${catName}`);
        }
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
