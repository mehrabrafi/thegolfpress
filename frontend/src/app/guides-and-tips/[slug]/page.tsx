import { fetchNews, fetchCategories } from '@/lib/api';
import GuideCategoryClient from './GuideCategoryClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const { slug } = await params;
    const tagName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

    return {
        title: `${tagName} — Golf Guides & Tips`,
        description: `Expert ${tagName.toLowerCase()} golf guides and tips to improve your game. Read professional instructional content from The Golf Press.`,
    };
}

export default async function GuideCategoryPage({ params }: { params: any }) {
    const { slug } = await params;
    let articles: any[] = [];
    let currentTagName = 'All Guides & Tips';

    try {
        const [newsData, catData] = await Promise.all([
            fetchNews(),
            fetchCategories(),
        ]);

        // Filter for Guides & Tips articles
        const guideArticles = newsData.filter((a: any) => {
            const c = (a.category || '').toUpperCase();
            return c === 'GUIDES-TIPS';
        });

        const guidesCat = catData.find((c: any) => c.slug === 'guides-tips' || c.name.toLowerCase() === 'guides & tips' || c.name.toLowerCase() === 'guides-tips');
        if (guidesCat && guidesCat.subTags) {
            const matchedTag = guidesCat.subTags.find((t: any) =>
                t.name.toLowerCase().replace(/ /g, '-') === slug.toLowerCase()
            );

            if (matchedTag) {
                currentTagName = matchedTag.name;
                articles = guideArticles.filter((a: any) =>
                    (a.categoryTag || '').toUpperCase() === matchedTag.name.toUpperCase()
                );
            } else {
                articles = guideArticles;
            }
        }
    } catch (error) {
        console.error('Error fetching guides & tips category data:', error);
    }

    return <GuideCategoryClient articles={articles} currentTagName={currentTagName} />;
}
