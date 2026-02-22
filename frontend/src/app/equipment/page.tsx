import { fetchNews } from '@/lib/api';
import EquipmentClient from './EquipmentClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Golf Equipment Reviews & Gear Guide | The Golf Press',
    description: 'Expert reviews of the latest golf clubs, balls, apparel, and tech. Real-world testing and technical breakdowns to help you find the best gear for your game.',
};

export default async function EquipmentPage() {
    let initialArticles = [];
    try {
        const { data } = await fetchNews('EQUIPMENT', undefined, undefined, 0, 6);
        initialArticles = data || [];
    } catch (error) {
        console.error('Error fetching initial equipment news:', error);
    }

    return <EquipmentClient initialArticles={initialArticles} />;
}
