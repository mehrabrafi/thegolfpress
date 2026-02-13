interface JsonLdProps {
    data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// Helper functions to create common structured data objects

export function createWebsiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'The Golf Press',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com',
        description: 'The definitive voice in golf. Real-time PGA Tour scores, expert instruction, and premium golf news.',
        publisher: {
            '@type': 'Organization',
            name: 'The Golf Press',
            logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com'}/logo.png`,
            },
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com'}/courses?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

export function createArticleJsonLd(article: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.description,
        image: article.image,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
            '@type': 'Person',
            name: article.authorName || 'The Golf Press Editorial',
        },
        publisher: {
            '@type': 'Organization',
            name: 'The Golf Press',
            logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com'}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': article.url,
        },
    };
}

export function createGolfCourseJsonLd(course: {
    name: string;
    description: string;
    image: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'GolfCourse',
        name: course.name,
        description: course.description,
        image: course.image,
        url: course.url,
    };
}

export function createBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
