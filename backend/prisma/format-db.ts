import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('⚠️  ডাটাবেস ফরম্যাট করা হচ্ছে (ইউজার বাদে বাকি সব মুছে ফেলা হচ্ছে)...');

    try {
        await prisma.$transaction(async (tx) => {
            // ১. ডেইলি অ্যাক্টিভিটি এবং অ্যানালিটিক্স মুছে ফেলা হচ্ছে
            console.log('ডিলিট হচ্ছে: DailyActivity...');
            await tx.dailyActivity.deleteMany();

            console.log('ডিলিট হচ্ছে: Analytics...');
            await tx.analytics.deleteMany();

            // ২. নিউজ আর্টিকেল মুছে ফেলা হচ্ছে
            // এটি NewsToPlayer এবং অন্যান্য রিলেশন টেবিল অটোমেটিক ক্লিন করবে
            console.log('ডিলিট হচ্ছে: News...');
            await tx.news.deleteMany();

            // ৩. সাব-ট্যাগ এবং ক্যাটাগরি মুছে ফেলা হচ্ছে
            console.log('ডিলিট হচ্ছে: SubTag...');
            await tx.subTag.deleteMany();

            console.log('ডিলিট হচ্ছে: Category...');
            await tx.category.deleteMany();

            // ৪. প্লেয়ার তথ্য মুছে ফেলা হচ্ছে 
            // এটি UserFollowsPlayer টেবিল ক্লিন করবে কিন্তু User রা থাকবে
            console.log('ডিলিট হচ্ছে: Player...');
            await tx.player.deleteMany();

            // ৫. সেটিংস মুছে ফেলা হচ্ছে
            console.log('ডিলিট হচ্ছে: Setting...');
            await tx.setting.deleteMany();
        });

        console.log('\n✅ ডাটাবেস সফলভাবে ফরম্যাট করা হয়েছে।');
        console.log('ℹ️  শুধুমাত্র User accounts এবং তাদের credentials সুরক্ষিত আছে।');
    } catch (error) {
        console.error('\n❌ ফরম্যাট করার সময় ভুল হয়েছে:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
