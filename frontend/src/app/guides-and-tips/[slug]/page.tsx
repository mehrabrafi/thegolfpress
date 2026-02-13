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

export default async function HowToCategoryPage({ params }: { params: any }) {
    const { slug } = await params;
    let articles: any[] = [];
    let currentTagName = 'All How-To';

    try {
        const [newsData, catData] = await Promise.all([
            fetchNews(),
            fetchCategories(),
        ]);

        // Filter for How-To articles
        const howToArticles = newsData.filter((a: any) => {
            const c = (a.category || '').toUpperCase();
            return c === 'HOW-TO' || c === 'HOW TO';
        });

        const howToCat = catData.find((c: any) => c.slug === 'how-to' || c.name.toLowerCase() === 'how-to');
        if (howToCat && howToCat.subTags) {
            const matchedTag = howToCat.subTags.find((t: any) =>
                t.name.toLowerCase().replace(/ /g, '-') === slug.toLowerCase()
            );

            if (matchedTag) {
                currentTagName = matchedTag.name;
                articles = howToArticles.filter((a: any) =>
                    (a.categoryTag || '').toUpperCase() === matchedTag.name.toUpperCase()
                );
            } else {
                articles = howToArticles;
            }
        }
    } catch (error) {
        console.error('Error fetching how-to category data:', error);
    }

    return <GuideCategoryClient articles={articles} currentTagName={currentTagName} />;
}
