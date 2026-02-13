import { fetchNews, fetchCategories } from '@/lib/api';
import GuidesClient from './GuidesClient';

export default async function GuidesAndTipsPage() {
    let howToArticles: any[] = [];
    let subTags: any[] = [];

    try {
        const [newsData, catData] = await Promise.all([
            fetchNews(),
            fetchCategories(),
        ]);

        // Filter for How-To articles
        howToArticles = newsData.filter((item: any) => {
            const cat = (item.category || '').toUpperCase();
            return cat === 'HOW-TO' || cat === 'HOW TO';
        });

        const howToCat = catData.find((c: any) => c.slug === 'how-to' || c.name.toLowerCase() === 'how-to');
        if (howToCat && howToCat.subTags) {
            subTags = howToCat.subTags;
        }
    } catch (error) {
        console.error('Error fetching guides data:', error);
    }

    return <GuidesClient howToArticles={howToArticles} subTags={subTags} />;
}
