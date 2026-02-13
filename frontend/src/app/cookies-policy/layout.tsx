import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookies Policy',
    description: 'The Golf Press cookies policy. Learn about the cookies we use, how they work, and how you can manage your cookie preferences.',
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
