import { fetchNews, fetchCategories } from '@/lib/api';
import GuideCategoryClient from './GuideCategoryClient';
import type { Metadata } from 'next';

const PAGE_SIZE = 10;

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
    let initialArticles: any[] = [];
    let total = 0;
    let currentTagName = 'All Guides & Tips';
    let matchedTagOriginalName = '';

    try {
        const catData = await fetchCategories();

        const guidesCat = catData.find((c: any) =>
            c.slug === 'guides-tips' ||
            c.name.toLowerCase() === 'guides & tips' ||
            c.name.toLowerCase() === 'guides-tips'
        );

        if (guidesCat && guidesCat.subTags) {
            const matchedTag = guidesCat.subTags.find((t: any) =>
                t.name.toLowerCase().replace(/ /g, '-') === slug.toLowerCase()
            );

            if (matchedTag) {
                currentTagName = matchedTag.name;
                matchedTagOriginalName = matchedTag.name;

                // Fetch paginated articles for this specific tag from the backend
                const { data, total: t } = await fetchNews('GUIDES-TIPS', matchedTag.name, undefined, 0, PAGE_SIZE);
                initialArticles = data ?? [];
                total = t ?? 0;
            }
        }
    } catch (error) {
        console.error('Error fetching guides & tips category data:', error);
    }

    return (
        <GuideCategoryClient
            initialArticles={initialArticles}
            pageSize={PAGE_SIZE}
            serverTotal={total}
            currentTagName={currentTagName}
            tagFilter={matchedTagOriginalName}
        />
    );
}
