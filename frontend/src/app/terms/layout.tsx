import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'The Golf Press terms of service. Review the terms and conditions governing use of our website, content services, and user accounts.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
