import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/news`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/courses`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/guides-and-tips`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/scores`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/rankings`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/schedule`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/players`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.2,
        },
        {
            url: `${SITE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.2,
        },
        {
            url: `${SITE_URL}/cookies-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.2,
        },
    ];

    // Dynamic: Fetch news articles for individual URLs
    let newsRoutes: MetadataRoute.Sitemap = [];
    let guideRoutes: MetadataRoute.Sitemap = [];
    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${API_BASE}/golf/news`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const articles = await res.json();
            articles.forEach((article: { id: string; category?: string; updatedAt?: string; createdAt?: string }) => {
                const categoryUpper = (article.category || '').toUpperCase();
                const isCourse = categoryUpper === 'COURSES';
                const isGuide = categoryUpper === 'GUIDES-TIPS';

                if (isGuide) {
                    guideRoutes.push({
                        url: `${SITE_URL}/guides-and-tips/post/${article.id}`,
                        lastModified: new Date(article.updatedAt || article.createdAt || Date.now()),
                        changeFrequency: 'weekly' as const,
                        priority: 0.6,
                    });
                } else {
                    newsRoutes.push({
                        url: isCourse
                            ? `${SITE_URL}/courses/${article.id}`
                            : `${SITE_URL}/news/${article.id}`,
                        lastModified: new Date(article.updatedAt || article.createdAt || Date.now()),
                        changeFrequency: 'weekly' as const,
                        priority: 0.6,
                    });
                }
            });
        }
    } catch {
        // Silently fail — sitemap will still include static routes
    }

    return [...staticRoutes, ...newsRoutes, ...guideRoutes];
}
