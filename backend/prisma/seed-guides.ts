import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMG = 'https://cdn.thegolfpress.com/d43609c4-2ebc-4da7-a2b4-6fc3d03c1a15.webp';

const CATEGORY_TAGS = ['Swing Sequence', 'Short Game', 'Putting', 'Driving', 'Fitness', 'Mental Game', 'Beginners'];

async function main() {
    console.log('Seeding Guides and Tips...');

    // 1. Find or Create Category
    let category = await prisma.category.findFirst({
        where: {
            OR: [
                { name: 'Guides & Tips' },
                { slug: 'guides-tips' },
                { name: 'How To' },
                { slug: 'how-to' }
            ]
        }
    });

    if (!category) {
        console.log('Creating "Guides & Tips" category...');
        category = await prisma.category.create({
            data: {
                name: 'Guides & Tips',
                slug: 'guides-tips'
            }
        });
    } else {
        console.log(`Found category: ${category.name} (${category.id})`);
    }

    // 2. Ensure SubTags exist
    for (const tagName of CATEGORY_TAGS) {
        const existingSubTag = await prisma.subTag.findFirst({
            where: {
                name: tagName,
                categoryId: category.id
            }
        });

        if (!existingSubTag) {
            console.log(`Creating SubTag: ${tagName}`);
            await prisma.subTag.create({
                data: {
                    name: tagName,
                    categoryId: category.id
                }
            });
        }
    }

    // 3. Create Articles
    console.log('Seeding 70 guide articles...');
    const newGuides: any[] = [];
    for (let i = 11; i <= 80; i++) {
        const tag = CATEGORY_TAGS[i % CATEGORY_TAGS.length];
        newGuides.push({
            id: `guide-${i}`,
            type: 'REGULAR',
            category: 'GUIDES-TIPS', // Used for filtering in page.tsx
            categoryTag: tag, // Used for grouping in GuidesClient.tsx
            title: `Golf Guide ${i}: Mastering the ${tag} - Essential Tips`,
            excerpt: `Learn the secrets of ${tag} with this comprehensive guide (Article ${i}). Improve your game with these expert tips.`,
            time: 'Just now',
            image: IMG,
            content: `<p>This is a seeded article for the Guide and Tips section. In this guide, we explore the nuances of <strong>${tag}</strong>.</p><p>Mastering this aspect of the game is crucial for lowering your scores.</p><p><strong>Key Tip 1:</strong> Focus on the fundamentals.</p><p><strong>Key Tip 2:</strong> Practice consistently.</p><p>Review the image above for visual reference.</p>`,
            publishedAt: new Date(),
            categoryId: category.id
        });
    }

    for (const guide of newGuides) {
        await prisma.news.upsert({
            where: { id: guide.id },
            update: guide,
            create: guide,
        });
    }

    console.log(`Successfully added ${newGuides.length} guide articles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
