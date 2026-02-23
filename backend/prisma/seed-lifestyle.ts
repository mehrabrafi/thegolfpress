import { PrismaClient, NewsStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMG = 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png';

async function main() {
    console.log('Seeding Lifestyle articles...');

    let categoryLifestyle = await prisma.category.findFirst({ where: { slug: 'lifestyle' } });
    if (!categoryLifestyle) {
        categoryLifestyle = await prisma.category.create({ data: { name: 'Lifestyle', slug: 'lifestyle' } });
    }

    const lifestyleArticles = [
        {
            id: 'lifestyle-1',
            title: 'Top 10 Golf Destinations for your Next Vacation',
            excerpt: 'Explore the world\'s most beautiful courses and where to stay for the ultimate golf experience.',
            content: '<p>From the rugged coastlines of Scotland to the sun-drenched fairways of the Algarve, we explore the top 10 golf destinations you need to visit in 2026. Whether you are looking for history, luxury, or pure challenge, these locations offer the best of the game.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '2 hours ago'
        },
        {
            id: 'lifestyle-2',
            title: 'Summer Collection: 2026 Golf Apparel Guide',
            excerpt: 'Stay cool and look sharp on the course with these top-rated apparel picks for the summer season.',
            content: '<p>As temperatures rise, staying comfortable on the course becomes a priority. Our 2026 Summer Apparel Guide highlights the latest in moisture-wicking technology and classic styles from the biggest brands in golf.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '5 hours ago'
        },
        {
            id: 'lifestyle-3',
            title: 'The Evolution of Luxury Golf Watches',
            excerpt: 'How timepieces became an essential part of the golfer\'s wardrobe and style.',
            content: '<p>Watches and golf have a long-standing relationship. Discover how the latest luxury timepieces are designed specifically for the movements of a golf swing while maintaining premium aesthetics for the clubhouse.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '1 day ago'
        },
        {
            id: 'lifestyle-4',
            title: 'Inside the Most Exclusive Golf Clubhouses',
            excerpt: 'A look behind the gates of the world\'s most private and prestigious golf clubs.',
            content: '<p>Step inside the world of private golf clubs where tradition meets ultimate luxury. From fine dining to world-class spas, these clubhouses offer an experience that goes far beyond the 18th hole.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '2 days ago'
        },
        {
            id: 'lifestyle-5',
            title: 'Golf & Gastronomy: The Best 19th Holes',
            excerpt: 'Discover the clubs that offer world-class dining experiences after your round.',
            content: '<p>The round doesn\'t end at 18. We\'ve curated a list of the best 19th holes around the globe where the food is just as impressive as the greens. Experience fine dining and craft cocktails with the best views in golf.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '3 days ago'
        },
        {
            id: 'lifestyle-6',
            title: 'The Rise of Performance Tech in Golf Fashion',
            excerpt: 'How modern fabrics are changing the way players think about comfort and style.',
            content: '<p>Functional fashion is taking over the fairways. Learn how high-performance materials are being integrated into everyday golf wear to improve mobility and temperature regulation without sacrificing a sleek appearance.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '4 days ago'
        },
        {
            id: 'lifestyle-7',
            title: 'Art on the Green: Minimalist Course Photography',
            excerpt: 'Meeting the photographers capturing the raw beauty of golf landscapes.',
            content: '<p>Golf courses are works of art. We speak with the photographers who specialize in capturing the minimalist beauty of early morning fairways and the dramatic shadows of links courses at sunset.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '5 days ago'
        },
        {
            id: 'lifestyle-8',
            title: 'Restorative Golf: The Best Wellness Spas',
            excerpt: 'Combining a championship round with top-tier recovery and wellness treatments.',
            content: '<p>Recovery is the secret to a long golf career. We visit the world\'s best golf resorts that offer integrated wellness programs, from cryotherapy to specialized golf massages, to help you stay at your peak.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '1 week ago'
        },
        {
            id: 'lifestyle-9',
            title: 'Vintage Vibes: The Return of Heritage Gear',
            excerpt: 'Why classic designs and natural materials are making a massive comeback.',
            content: '<p>What was old is new again. From leather carry bags to wool sweaters, the heritage look is returning to the game in a big way. We look at the brands leading this retro revolution with modern twists.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '1 week ago'
        },
        {
            id: 'lifestyle-10',
            title: 'Collectors Edition: Rare Golf Memorabilia',
            excerpt: 'A guide to investing in the artifacts that defined the history of the game.',
            content: '<p>Golf history is collectible. From signed programs to championship-winning clubs, find out which items are currently soaring in value and how to start your own collection of golf memorabilia.</p>',
            image: IMG,
            category: 'LIFESTYLE',
            categoryId: categoryLifestyle.id,
            status: NewsStatus.PUBLISHED,
            type: 'REGULAR',
            author: 'The Golf Press',
            time: '2 weeks ago'
        }
    ];

    for (const article of lifestyleArticles) {
        await prisma.news.upsert({
            where: { id: article.id },
            update: article,
            create: article,
        });
    }

    console.log('Lifestyle seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
