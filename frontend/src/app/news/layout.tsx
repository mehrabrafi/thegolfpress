import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'News Archive',
    description: 'Stay updated with the latest golf news. Breaking stories, tournament analysis, player updates, and insider coverage from the PGA Tour and golf world.',
    openGraph: {
        title: 'Golf News Archive | The Golf Press',
        description: 'Breaking golf stories, tournament analysis, and insider coverage from the PGA Tour.',
    },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
