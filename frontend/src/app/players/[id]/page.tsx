import { fetchPlayerProfile } from '@/lib/api';
import PlayerProfileClient from './PlayerProfileClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    try {
        const { id } = await params;
        const player = await fetchPlayerProfile(id);
        return {
            title: `${player.name} - Player Profile | GolfWire Pro`,
            description: `Full career details, stats, and biography for ${player.name}. Age: ${player.age}, Country: ${player.citizenship}.`,
            openGraph: {
                title: `${player.name} Stats & Bio`,
                description: `Check out ${player.name}'s professional golf highlights.`,
                images: [player.image || ''],
            },
        };
    } catch (error) {
        return { title: 'Player Profile | GolfWire Pro' };
    }
}

export default async function PlayerProfilePage({ params }: { params: any }) {
    const { id } = await params;
    return <PlayerProfileClient id={id} />;
}
