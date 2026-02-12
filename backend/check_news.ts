import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const news = await prisma.news.findMany({ take: 5 });
    console.log('News found:', news.length);
    news.forEach(n => console.log(`ID: ${n.id}, Category: ${n.category}, Title: ${n.title}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
