import { fetchNews, fetchCategories } from '@/lib/api';
import GuidesClient from './GuidesClient';

export default async function GuidesAndTipsPage() {
    let guideArticles: any[] = [];
    let subTags: any[] = [];

    try {
        const [newsData, catData] = await Promise.all([
            fetchNews(),
            fetchCategories(),
        ]);

        // Filter for Guides & Tips articles
        guideArticles = newsData.filter((item: any) => {
            const cat = (item.category || '').toUpperCase();
            return cat === 'GUIDES-TIPS';
        });

        const guidesCat = catData.find((c: any) => c.slug === 'guides-tips' || c.name.toLowerCase() === 'guides & tips' || c.name.toLowerCase() === 'guides-tips');
        if (guidesCat && guidesCat.subTags) {
            subTags = guidesCat.subTags;
        }
    } catch (error) {
        console.error('Error fetching guides data:', error);
    }

    return <GuidesClient guideArticles={guideArticles} subTags={subTags} />;
}
