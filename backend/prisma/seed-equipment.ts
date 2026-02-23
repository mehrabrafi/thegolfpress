import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMG = 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png';

const TAGS = [
    'Drivers', 'Irons', 'Putters', 'Wedges', 'Balls', 'Bags', 'Shoes', 'Apparel', 'Accessories', 'Tech'
];

async function main() {
    console.log('Seeding 30 equipment articles...');

    // 1. Find or Create Category
    let category = await prisma.category.findFirst({
        where: { name: 'Equipment' }
    });

    if (!category) {
        console.log('Creating "Equipment" category...');
        category = await prisma.category.create({
            data: {
                name: 'Equipment',
                slug: 'equipment'
            }
        });
    }

    // 2. Ensure SubTags exist
    for (const tag of TAGS) {
        const existingSubTag = await prisma.subTag.findFirst({
            where: {
                name: tag,
                categoryId: category.id
            }
        });

        if (!existingSubTag) {
            console.log(`Creating SubTag: ${tag}`);
            await prisma.subTag.create({
                data: {
                    name: tag,
                    categoryId: category.id
                }
            });
        }
    }

    const newArticles: any[] = [];
    for (let i = 1; i <= 30; i++) {
        const tag = TAGS[i % TAGS.length];
        newArticles.push({
            id: `equipment-article-${i}`,
            type: 'REGULAR',
            category: 'EQUIPMENT',
            categoryTag: tag,
            title: `Equipment Guide ${i}: The Best ${tag} of 2026`,
            excerpt: `Looking for the best ${tag.toLowerCase()} to improve your game? We tested the top models and here are our top picks (Review ${i}).`,
            time: 'Just now',
            image: IMG,
            content: `<p>In this review, we test the newest <strong>${tag.toLowerCase()}</strong> to hit the market in 2026.</p><p>We look at performance, feel, forgiveness, and value for money.</p><h3>Performance Analysis</h3><p>The numbers don't lie. Our launch monitor data shows significant improvements.</p><h3>Final Verdict</h3><p>An absolute must-try if you are serious about upgrading your gear.</p><p><img src="${IMG}" alt="Equipment View" /></p>`,
            publishedAt: new Date(),
            categoryId: category.id,
            author: 'The Golf Press Team',
        });
    }

    // Upsert batches
    for (const article of newArticles) {
        await prisma.news.upsert({
            where: { id: article.id },
            update: article,
            create: article,
        });
    }

    console.log(`Successfully added ${newArticles.length} equipment articles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
