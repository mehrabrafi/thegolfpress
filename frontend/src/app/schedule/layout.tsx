import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PGA Tour Schedule',
    description: '2026 PGA Tour schedule with tournament dates, locations, purses, and live status updates. Plan your golf calendar for the entire season.',
    openGraph: {
        title: '2026 PGA Tour Schedule | The Golf Press',
        description: 'Complete PGA Tour schedule with dates, locations, and purse information.',
    },
};

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return children;
}
