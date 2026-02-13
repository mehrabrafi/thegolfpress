import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PGA Tour Players',
    description: 'Browse PGA Tour player profiles, stats, and career highlights. View rankings by scoring average, driving distance, and more performance metrics.',
    openGraph: {
        title: 'PGA Tour Players | The Golf Press',
        description: 'Browse PGA Tour player profiles, stats, and career highlights.',
    },
};

export default function PlayersLayout({ children }: { children: React.ReactNode }) {
    return children;
}
