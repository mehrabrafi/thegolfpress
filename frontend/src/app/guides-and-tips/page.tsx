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

        // Filter for Guides & Tips articles (matches both old "How-To" and new "Guides-Tips" names)
        guideArticles = newsData.data.filter((item: any) => {
            const cat = (item.category || '').toUpperCase();
            return cat === 'HOW-TO' || cat === 'GUIDES-TIPS' || cat === 'GUIDES & TIPS';
        });

        const guidesCat = catData.find((c: any) =>
            c.slug === 'how-to' || c.slug === 'guides-tips' ||
            c.name.toLowerCase() === 'how-to' ||
            c.name.toLowerCase() === 'guides & tips' ||
            c.name.toLowerCase() === 'guides-tips'
        );
        if (guidesCat && guidesCat.subTags) {
            subTags = guidesCat.subTags;
        }
    } catch (error) {
        console.error('Error fetching guides data:', error);
    }

    return <GuidesClient guideArticles={guideArticles} subTags={subTags} />;
}
