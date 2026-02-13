import { fetchPlayerProfile } from '@/lib/api';
import PlayerProfileClient from './PlayerProfileClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    try {
        const { id } = await params;
        const player = await fetchPlayerProfile(id);
        const description = `Full career details, stats, and biography for ${player.name}. Age: ${player.age}, Country: ${player.citizenship}.`;
        return {
            title: `${player.name} - Player Profile | The Golf Press`,
            description,
            keywords: [player.name, 'golf', 'PGA Tour', 'player profile', 'golf stats', 'career highlights', player.citizenship || ''].filter(Boolean),
            robots: { index: true, follow: true },
            openGraph: {
                title: `${player.name} Stats & Bio | The Golf Press`,
                description: `Check out ${player.name}'s professional golf highlights, stats, and career records.`,
                images: player.image ? [{ url: player.image, alt: player.name }] : [],
                type: 'profile',
                siteName: 'The Golf Press',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${player.name} - Player Profile | The Golf Press`,
                description,
                images: player.image ? [player.image] : [],
            },
        };
    } catch (error) {
        return { title: 'Player Profile | The Golf Press' };
    }
}

export default async function PlayerProfilePage({ params }: { params: any }) {
    const { id } = await params;
    return <PlayerProfileClient id={id} />;
}
