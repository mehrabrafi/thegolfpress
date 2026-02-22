import { fetchNewsById, fetchNews } from '@/lib/api';
import EquipmentDetailClient from './EquipmentDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    try {
        const { id } = await params;
        const article = await fetchNewsById(id);
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';
        return {
            title: `${article.title} | The Gear Room`,
            description: article.excerpt || `Expert review of ${article.title} — only on The Golf Press.`,
            openGraph: {
                title: article.title,
                description: article.excerpt || article.title,
                type: 'article',
                publishedTime: article.createdAt,
                modifiedTime: article.updatedAt || article.createdAt,
                authors: [article.author || 'The Golf Press Editorial'],
                images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : [],
                url: `${SITE_URL}/equipment/${id}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.excerpt || article.title,
                images: article.image ? [article.image] : [],
            },
        };
    } catch {
        return { title: 'Equipment Review | The Golf Press' };
    }
}

export default async function EquipmentDetailPage({ params }: { params: any }) {
    const { id } = await params;

    try {
        const [article, allNewsResult] = await Promise.allSettled([
            fetchNewsById(id),
            fetchNews('EQUIPMENT'),
        ]);

        const articleData = article.status === 'fulfilled' ? article.value : null;

        if (!articleData) {
            return (
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Review not found</h2>
                    <p>The equipment review you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            );
        }

        const relatedNews = allNewsResult.status === 'fulfilled' ? allNewsResult.value.data.filter((n: any) => n.id !== id) : [];

        return (
            <EquipmentDetailClient
                id={id}
                initialArticle={articleData}
                initialRelated={relatedNews}
            />
        );
    } catch (error) {
        console.error('Error loading equipment detail:', error);
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Error loading review</h2>
                <p>Please try again later.</p>
            </div>
        );
    }
}
