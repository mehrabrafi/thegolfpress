import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/tgpadmin/', '/login', '/signup', '/api/'],
            },
            {
                userAgent: ['GPTBot', 'CCBot', 'Google-Extended'],
                disallow: '/',
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
