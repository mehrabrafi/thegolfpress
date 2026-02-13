import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'The Golf Press privacy policy. Learn how we collect, use, and protect your personal information when using our golf news and content platform.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
