import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding data...');

    // Create Authors
    const michael = await prisma.author.upsert({
        where: { id: 'michael' },
        update: {},
        create: {
            id: 'michael',
            name: 'Michael Breed',
            image: 'https://i.pravatar.cc/150?u=michael',
        },
    });

    const sarah = await prisma.author.upsert({
        where: { id: 'sarah' },
        update: {},
        create: {
            id: 'sarah',
            name: 'Sarah Stirk',
            image: 'https://i.pravatar.cc/150?u=sarah',
        },
    });

    const staff = await prisma.author.upsert({
        where: { id: 'staff' },
        update: {},
        create: {
            id: 'staff',
            name: 'GolfWire Staff',
            image: 'https://i.pravatar.cc/150?u=staff',
        },
    });

    const david = await prisma.author.upsert({
        where: { id: 'david' },
        update: {},
        create: {
            id: 'david',
            name: 'David Leadbetter',
            image: 'https://i.pravatar.cc/150?u=david',
        },
    });

    // Create News
    const newsData = [
        {
            id: '1',
            type: 'FEATURED',
            category: 'TOURNAMENT',
            title: "Scottie Scheffler's Historic Run Continues at The Masters",
            excerpt: "The world number one delivers a masterclass performance, pulling away from the field on a demanding Sunday afternoon at Augusta National.",
            time: '15 min ago',
            image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop',
            content: "Scottie Scheffler confirmed his status as the best player in the world with a commanding four-shot victory at The Masters. The world number one displayed nerves of steel and unmatched precision on a gusty Sunday at Augusta National. Starting the day with a one-shot lead, Scheffler quickly established dominance with a flurry of birdies on the front nine. Even a minor setback on the 10th didn't shake his confidence as he recovered with a spectacular approach on the 13th to set up a crucial birdie. By the time he reached the 18th hole, the green jacket was essentially his, allowing for an emotional walk up the final fairway. This victory marks his second Masters title in three years, solidifying his place among golf's elite.",
            authorId: michael.id,
        },
        {
            id: '2',
            type: 'REGULAR',
            category: 'EQUIPMENT',
            categoryTag: 'GEAR',
            title: "The New TaylorMade Driver: Comprehensive Review & Testing Data",
            excerpt: "We put the latest innovation from TaylorMade to the test with trackman data to see if it lives up to the marketing hype.",
            time: '2 hours ago',
            image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop',
            content: "TaylorMade has once again pushed the boundaries of golf equipment with their latest driver release. Our testing center spent a week with the new model, putting it through rigorous sessions with players of various skill levels. The standout feature is the refined face technology, which TaylorMade claims significantly improves ball speeds on off-center hits. Our Trackman data confirmed these claims, showing a consistent 2-3 mph increase compared to last year's model. The sound and feel have also been noticeably improved, offering a more muted and 'tour-like' impact. While the price tag is premium, the performance gains and added forgiveness make it a serious contender for the best driver of the year.",
            authorId: michael.id,
        },
        {
            id: '3',
            type: 'REGULAR',
            category: 'TOURNAMENT',
            categoryTag: 'PGA TOUR',
            title: "Ticket Demand Soars for U.S. Open at Pinehurst No. 2",
            excerpt: "With Tiger Woods confirming his participation, secondary market prices have hit record highs for the upcoming major championship.",
            time: '4 hours ago',
            image: 'https://images.unsplash.com/photo-1623126742512-eb7e313783a3?q=80&w=2062&auto=format&fit=crop',
            content: "The anticipation for the upcoming U.S. Open at the legendary Pinehurst No. 2 has reached fever pitch. Following the official announcement that Tiger Woods will be competing, ticket demand has surged beyond all previous records. Platforms like StubHub and SeatGeek reporting a 300% increase in search volume within hours of the news. Weekly badges that were originally priced at $500 are now trading for upwards of $2,000. Pinehurst officials have alerted fans to be wary of counterfeit tickets and to only purchase through official channels. The combination of interest in the 'ultimate test in golf' and the return of the game's greatest icon makes this the most anticipated major in recent memory.",
            authorId: sarah.id,
        },
        {
            id: '4',
            type: 'REGULAR',
            category: 'BREAKING',
            categoryTag: 'LIV GOLF',
            title: "Rahm's Team Legion XIII Adds New Sponsor in Multi-Year Deal",
            excerpt: "The defending Masters champion continues to build his franchise value with a significant partnership announcement ahead of the next event.",
            time: '6 hours ago',
            image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2076&auto=format&fit=crop',
            content: "Jon Rahm's Legion XIII has secured a landmark sponsorship deal with a major global financial services firm. The deal, rumored to be worth in the eight-figure range over several years, marks one of the most significant commercial milestones for any LIV Golf franchise to date. The partnership will include prominent branding on team apparel and equipment, as well as joint marketing initiatives focused on expanding the team's reach in the European market. Rahm spoke enthusiastically about the partnership during a press conference today, stating that 'this is a testament to the growth and potential of team golf.' As the league moves towards a more sustainable franchise model, expect more of these major brand alignments.",
            authorId: staff.id,
        },
        {
            id: '5',
            type: 'REGULAR',
            category: 'TIPS & DRILLS',
            categoryTag: 'INSTRUCTION',
            title: "Mastering the Flop Shot: 3 Secrets from Phil Mickelson",
            excerpt: "Learn the technique behind one of the most difficult shots in golf from the left-handed magician himself.",
            time: 'Yesterday',
            image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop',
            content: "Phil Mickelson is widely regarded as having the best short game in the history of golf, and his flop shot is legendary. In an exclusive clinic, Phil shared three key secrets to executing this high-risk, high-reward shot. First, he emphasizes the importance of a wide stance and 'hinging' the wrists early in the backswing. Second, he reveals that the speed of the clubhead must remain constant through the impact zone - decelerating is the most common mistake amateurs make. Finally, Phil shows how the follow-through should mirror the backswing to ensure proper loft and spin. Practice these drills on a soft bunker before trying them on the fairway, and you'll soon be tackling those tight pins with confidence.",
            authorId: david.id,
        },
    ];

    // Create How-To Articles (20 entries)
    const howToTitles = [
        { title: "The Perfect Backswing: Loading for Power", tag: "Swing Sequence" },
        { title: "Hinge and Hold: The Secret to Chipping", tag: "Short Game" },
        { title: "3 Drills for Better Distance Control", tag: "Putting" },
        { title: "Finding Your Natural Tempo", tag: "Swing Sequence" },
        { title: "How to Hit a Power Draw", tag: "Driving" },
        { title: "5 Essential Stretches for Every Golfer", tag: "Fitness" },
        { title: "Staying Calm Under Pressure", tag: "Mental Game" },
        { title: "Bunker Basics: Splashing it Out", tag: "Short Game" },
        { title: "Grip Pressure: How Tight is Too Tight?", tag: "Beginners" },
        { title: "The Importance of Body Rotation", tag: "Swing Sequence" },
        { title: "Lag Putting: Stop Three-Putting", tag: "Putting" },
        { title: "Increase Your Clubhead Speed", tag: "Driving" },
        { title: "Understanding Ball Flight Laws", tag: "Beginners" },
        { title: "Pre-Shot Routine: The Blueprint", tag: "Mental Game" },
        { title: "Core Stability for a Rock-Solid Swing", tag: "Fitness" },
        { title: "Mastering the Flop Shot", tag: "Short Game" },
        { title: "The Role of the Lead Arm", tag: "Swing Sequence" },
        { title: "Reading Greens Like a Pro", tag: "Putting" },
        { title: "Stinger Shot: Low and Straight", tag: "Driving" },
        { title: "First Tee Jitters: Overcome Them", tag: "Beginners" }
    ];

    const howToData = howToTitles.map((item, i) => ({
        id: `ht-${i + 1}`,
        type: 'REGULAR',
        category: 'HOW-TO',
        categoryTag: item.tag,
        title: item.title,
        excerpt: `Discover the best techniques for ${item.title.toLowerCase()} to improve your game.`,
        time: `${i + 1} days ago`,
        image: `https://images.unsplash.com/photo-${1535131749006 + (i * 100)}?q=80&w=800&auto=format&fit=crop`,
        content: `Detailed guide on ${item.title}. This instruction will help you master the craft of golf with professional tips and drills.`,
        authorId: staff.id,
    }));

    // Create Course Articles (20 entries)
    const courseTitles = [
        { title: "St Andrews (Old Course), Scotland", tag: "Scotland" },
        { title: "Royal County Down, N. Ireland", tag: "United Kingdom" },
        { title: "Royal Dornoch, Scotland", tag: "Scotland" },
        { title: "Muirfield, Scotland", tag: "Scotland" },
        { title: "Carnoustie (Championship), Scotland", tag: "Scotland" },
        { title: "Royal St George’s, England", tag: "England" },
        { title: "Sunningdale (Old), England", tag: "England" },
        { title: "Royal Birkdale, England", tag: "England" },
        { title: "Pinehurst No. 2, North Carolina", tag: "USA" },
        { title: "Pebble Beach, California", tag: "California" },
        { title: "TPC Sawgrass, Florida", tag: "Florida" },
        { title: "Bethpage Black, New York", tag: "New York" },
        { title: "Austin Country Club, Texas", tag: "Texas" },
        { title: "Monte Rei North, Portugal", tag: "Portugal" },
        { title: "Valderrama, Spain", tag: "Spain" },
        { title: "Kingsbarns, Scotland", tag: "Scotland" },
        { title: "Royal Lytham & St Annes, England", tag: "England" },
        { title: "Trump International Golf Links, Scotland", tag: "Scotland" },
        { title: "Quinta do Lago (South), Portugal", tag: "Portugal" },
        { title: "Finca Cortesin, Spain", tag: "Spain" }
    ];

    const coursesData = courseTitles.map((item, i) => ({
        id: `course-${i + 1}`,
        type: 'REGULAR',
        category: 'COURSES',
        categoryTag: item.tag,
        title: item.title,
        excerpt: `A comprehensive review of ${item.title}, one of the top-rated courses in the world.`,
        time: `${i + 1} weeks ago`,
        image: `https://images.unsplash.com/photo-${1587174486073 + (i * 100)}?q=80&w=800&auto=format&fit=crop`,
        content: `${item.title} offers an unparalleled golfing experience with stunning views and challenging layouts.`,
        authorId: staff.id,
    }));

    const allData = [...newsData, ...howToData, ...coursesData];

    for (const news of allData) {
        await prisma.news.upsert({
            where: { id: news.id },
            update: news,
            create: news,
        });
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
