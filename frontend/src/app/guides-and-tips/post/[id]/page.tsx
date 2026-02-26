import { fetchNewsById, fetchNews } from '@/lib/api';
import GuideDetailClient from './GuideDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    try {
        const { id } = await params;
        const article = await fetchNewsById(id);
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';
        return {
            title: `${article.title} | Guides & Tips`,
            description: article.excerpt || `Read "${article.title}" — expert golf instruction from The Golf Press.`,
            openGraph: {
                title: article.title,
                description: article.excerpt || article.title,
                type: 'article',
                publishedTime: article.createdAt,
                modifiedTime: article.updatedAt || article.createdAt,
                authors: [article.author || 'The Golf Press Editorial'],
                images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.imageAlt || article.title }] : [],
                url: `${SITE_URL}/guides-and-tips/post/${id}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.excerpt || article.title,
                images: article.image ? [article.image] : [],
            },
        };
    } catch {
        return { title: 'Guide | The Golf Press' };
    }
}

export default async function GuideDetailPage({ params }: { params: any }) {
    const { id } = await params;

    try {
        const [article, allNewsResult] = await Promise.allSettled([
            fetchNewsById(id),
            fetchNews(),
        ]);

        const articleData = article.status === 'fulfilled' ? article.value : null;

        if (!articleData) {
            return (
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Guide not found</h2>
                    <p>The guide you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                </div>
            );
        }

        const allNews = allNewsResult.status === 'fulfilled' ? allNewsResult.value.data : [];

        // Get related Guides & Tips articles (same category)
        const relatedGuides = allNews.filter((n: any) => {
            const cat = (n.category || '').toUpperCase();
            return (cat === 'GUIDES-TIPS') && n.id !== id;
        });

        return (
            <GuideDetailClient
                id={id}
                initialArticle={articleData}
                initialRelated={relatedGuides}
            />
        );
    } catch (error) {
        console.error('Error loading guide detail:', error);
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Error loading guide</h2>
                <p>Please try again later.</p>
            </div>
        );
    }
}
