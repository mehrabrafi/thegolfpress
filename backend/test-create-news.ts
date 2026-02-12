import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Get a category
    const category = await prisma.category.findFirst();
    if (!category) {
        console.log('No categories found, cannot test.');
        return;
    }
    console.log('Using category:', category);

    // 2. Prepare payload similar to frontend
    const data = {
        title: "Test News",
        excerpt: "Test Excerpt",
        content: "Test Content",
        image: "http://example.com/image.jpg",
        categoryId: "", /* category.id */
        category: "Manual Category",
        subTagId: "",
        categoryTag: "",
        type: "REGULAR",
        status: "PUBLISHED",
        publishedAt: new Date().toISOString()
    };

    // 3. Simulate GolfService logic
    console.log('Simulating GolfService logic...');
    try {
        const result = await prisma.news.create({
            data: {
                title: data.title,
                excerpt: data.excerpt,
                content: data.content,
                image: data.image,
                category: data.category,
                type: data.type || "REGULAR" as any,
                categoryTag: data.categoryTag || data.category,
                time: "Now",
                status: "PUBLISHED", // Enum literal
                publishedAt: new Date(data.publishedAt),

                // Logic from service
                // categoryId: data.categoryId || null, // Commented out in service
                categoryRef: data.categoryId ? { connect: { id: data.categoryId } } : undefined,

                // subTagId: data.subTagId || null, // Commented out in service
                subTag: data.subTagId ? { connect: { id: data.subTagId } } : undefined
            }
        });
        console.log('Created news:', result);
    } catch (e) {
        console.error('Error creating news:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
