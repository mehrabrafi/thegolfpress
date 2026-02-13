import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PGA Tour Rankings',
    description: 'Official PGA Tour player rankings and season statistics. Track top golfers by scoring average, driving distance, putting, and more.',
    openGraph: {
        title: 'PGA Tour Rankings | The Golf Press',
        description: 'Official PGA Tour player rankings and season statistics.',
    },
};

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
