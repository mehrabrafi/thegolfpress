import { fetchNewsById, fetchNews, fetchTrendingNews } from '@/lib/api';
import NewsDetailClient from './NewsDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    try {
        const { id } = await params;
        const article = await fetchNewsById(id);
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';
        return {
            title: article.title,
            description: article.excerpt || `Read "${article.title}" — the latest from The Golf Press editorial team.`,
            openGraph: {
                title: article.title,
                description: article.excerpt || article.title,
                type: 'article',
                publishedTime: article.createdAt,
                modifiedTime: article.updatedAt || article.createdAt,
                authors: [article.author?.name || 'The Golf Press Editorial'],
                images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : [],
                url: `${SITE_URL}/news/${id}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.excerpt || article.title,
                images: article.image ? [article.image] : [],
            },
        };
    } catch {
        return { title: 'Article | The Golf Press' };
    }
}

export default async function NewsDetailPage({ params }: { params: any }) {
    const { id } = await params;

    try {
        // Fetch article and related data server-side in parallel
        const [article, allNewsResult, trendingResult] = await Promise.allSettled([
            fetchNewsById(id),
            fetchNews(),
            fetchTrendingNews(),
        ]);

        const articleData = article.status === 'fulfilled' ? article.value : null;

        if (!articleData) {
            return (
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Article not found</h2>
                    <p>The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                </div>
            );
        }

        const allNews = allNewsResult.status === 'fulfilled' ? allNewsResult.value : [];
        const trending = trendingResult.status === 'fulfilled' ? trendingResult.value : [];

        // Get related articles from same category
        const categoryRaw = articleData.category || articleData.categoryTag;
        const categoryFetch = categoryRaw ? categoryRaw.toUpperCase() : undefined;
        const relatedNews = categoryFetch
            ? allNews.filter((n: any) => (n.category || '').toUpperCase() === categoryFetch && n.id !== id)
            : [];

        return (
            <NewsDetailClient
                id={id}
                initialArticle={articleData}
                initialRelated={relatedNews}
                initialTrending={trending}
            />
        );
    } catch (error) {
        console.error('Error loading news detail:', error);
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Error loading article</h2>
                <p>Please try again later.</p>
            </div>
        );
    }
}
