import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Guides & Tips',
    description: 'Expert golf instruction, how-to guides, and pro tips to improve your game. From putting techniques to driving distance — elevate your golf skills.',
    openGraph: {
        title: 'Golf Guides & Tips | The Golf Press',
        description: 'Expert golf instruction and how-to guides to improve your game.',
    },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
