import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PLAYERS = [
    { id: '10592', name: 'Scottie Scheffler', slug: 'scottie-scheffler', image: 'https://a.espncdn.com/i/headshots/golf/players/full/10592.png' },
    { id: '3470', name: 'Rory McIlroy', slug: 'rory-mcilroy', image: 'https://a.espncdn.com/i/headshots/golf/players/full/3470.png' },
    { id: '9709', name: 'Jon Rahm', slug: 'jon-rahm', image: 'https://a.espncdn.com/i/headshots/golf/players/full/9709.png' },
    { id: '10101', name: 'Xander Schauffele', slug: 'xander-schauffele', image: 'https://a.espncdn.com/i/headshots/golf/players/full/10101.png' },
    { id: '11202', name: 'Viktor Hovland', slug: 'viktor-hovland', image: 'https://a.espncdn.com/i/headshots/golf/players/full/11202.png' },
    { id: '11203', name: 'Ludvig Åberg', slug: 'ludvig-aberg', image: 'https://a.espncdn.com/i/headshots/golf/players/full/11203.png' },
    { id: '11204', name: 'Wyndham Clark', slug: 'wyndham-clark', image: 'https://a.espncdn.com/i/headshots/golf/players/full/11204.png' },
    { id: '11205', name: 'Collin Morikawa', slug: 'collin-morikawa', image: 'https://a.espncdn.com/i/headshots/golf/players/full/11205.png' },
    { id: '11206', name: 'Patrick Cantlay', slug: 'patrick-cantlay', image: 'https://a.espncdn.com/i/headshots/golf/players/full/11206.png' },
    { id: '11207', name: 'Jordan Spieth', slug: 'jordan-spieth', image: 'https://a.espncdn.com/i/headshots/golf/players/full/11207.png' },
];

async function main() {
    console.log('Clearing existing players...');
    await prisma.player.deleteMany();

    console.log('Seeding players with ESPN IDs...');

    for (const player of PLAYERS) {
        await prisma.player.create({
            data: player,
        });
    }

    console.log(`Successfully seeded ${PLAYERS.length} players.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
