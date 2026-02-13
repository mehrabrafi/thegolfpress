import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Live Scores',
    description: 'Real-time PGA Tour leaderboard and live golf scores. Follow every shot, every hole, and every round as they happen across tournaments worldwide.',
    openGraph: {
        title: 'Live Golf Scores & Leaderboard | The Golf Press',
        description: 'Real-time PGA Tour leaderboard and live golf scores.',
    },
};

export default function ScoresLayout({ children }: { children: React.ReactNode }) {
    return children;
}
