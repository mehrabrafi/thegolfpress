import { fetchNewsById, fetchNews } from '@/lib/api';
import LifestyleDetailClient from './LifestyleDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    try {
        const { id } = await params;
        const article = await fetchNewsById(id);
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';
        return {
            title: `${article.title} | Aesthetic & Life`,
            description: article.excerpt || `Experience ${article.title} — the art of the golf lifestyle on The Golf Press.`,
            openGraph: {
                title: article.title,
                description: article.excerpt || article.title,
                type: 'article',
                publishedTime: article.createdAt,
                modifiedTime: article.updatedAt || article.createdAt,
                authors: [article.author || 'The Golf Press Editorial'],
                images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : [],
                url: `${SITE_URL}/lifestyle/${id}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.excerpt || article.title,
                images: article.image ? [article.image] : [],
            },
        };
    } catch {
        return { title: 'Lifestyle | The Golf Press' };
    }
}

export default async function LifestyleDetailPage({ params }: { params: any }) {
    const { id } = await params;

    try {
        const [article, allNewsResult] = await Promise.allSettled([
            fetchNewsById(id),
            fetchNews('LIFESTYLE'),
        ]);

        const articleData = article.status === 'fulfilled' ? article.value : null;

        if (!articleData) {
            return (
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Story not found</h2>
                    <p>The lifestyle story you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            );
        }

        const relatedNews = allNewsResult.status === 'fulfilled' ? allNewsResult.value.data.filter((n: any) => n.id !== id) : [];

        return (
            <LifestyleDetailClient
                id={id}
                initialArticle={articleData}
                initialRelated={relatedNews}
            />
        );
    } catch (error) {
        console.error('Error loading lifestyle detail:', error);
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Error loading story</h2>
                <p>Please try again later.</p>
            </div>
        );
    }
}
