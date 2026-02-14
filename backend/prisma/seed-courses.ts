import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMG = 'https://cdn.thegolfpress.com/d43609c4-2ebc-4da7-a2b4-6fc3d03c1a15.webp';

const LOCATIONS = [
    'Scotland', 'USA', 'Spain', 'England', 'Ireland', 'Portugal', 'Australia', 'Japan', 'South Africa', 'Canada'
];

async function main() {
    console.log('Seeding 70 course review articles...');

    // 1. Find or Create Category
    let category = await prisma.category.findFirst({
        where: { name: 'Courses' }
    });

    if (!category) {
        console.log('Creating "Courses" category...');
        category = await prisma.category.create({
            data: {
                name: 'Courses',
                slug: 'courses'
            }
        });
    }

    // 2. Ensure SubTags exist
    for (const loc of LOCATIONS) {
        const existingSubTag = await prisma.subTag.findFirst({
            where: {
                name: loc,
                categoryId: category.id
            }
        });

        if (!existingSubTag) {
            console.log(`Creating SubTag: ${loc}`);
            await prisma.subTag.create({
                data: {
                    name: loc,
                    categoryId: category.id
                }
            });
        }
    }

    const newCourses: any[] = [];
    for (let i = 1; i <= 70; i++) {
        const location = LOCATIONS[i % LOCATIONS.length];
        newCourses.push({
            id: `course-review-${i}`,
            type: 'REGULAR',
            category: 'COURSES',
            categoryTag: location,
            title: `Course Review ${i}: The Hidden Gem of ${location}`,
            excerpt: `Discover why this course in ${location} is a must-play. A comprehensive review of the layout, conditions, and experience (Review ${i}).`,
            time: 'Just now',
            image: IMG,
            content: `<p>In this review, we take a closer look at one of the finest courses in <strong>${location}</strong>.</p><p>From the moment you step onto the first tee, the experience is breathtaking.</p><h3>Layout & Design</h3><p>The course offers a challenging yet fair test for golfers of all abilities.</p><h3>Conditioning</h3><p>Immaculate fairways and true-rolling greens make for a perfect day out.</p><p><img src="${IMG}" alt="Course View" /></p>`,
            publishedAt: new Date(),
            categoryId: category.id,
            // We could link subTagId if we looked it up, but strictly speaking distinct fields are used in frontend for now.
            // But let's try to do it right if possible.
        });
    }

    // Upsert batches
    for (const course of newCourses) {
        await prisma.news.upsert({
            where: { id: course.id },
            update: course,
            create: course,
        });
    }

    console.log(`Successfully added ${newCourses.length} course review articles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
