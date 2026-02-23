import { fetchNews } from '@/lib/api';
import LifestyleClient from './LifestyleClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Golf Lifestyle & Style | The Golf Press',
    description: 'Explore the aesthetic side of golf. From high-end apparel to the world\'s most beautiful travel destinations and luxury accessories.',
};

export default async function LifestylePage() {
    let initialArticles = [];
    try {
        const { data } = await fetchNews('LIFESTYLE', undefined, undefined, 0, 10);
        initialArticles = data || [];
    } catch (error) {
        console.error('Error fetching initial lifestyle news:', error);
    }

    return <LifestyleClient initialArticles={initialArticles} />;
}
