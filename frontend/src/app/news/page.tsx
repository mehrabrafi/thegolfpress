import { fetchNews } from '@/lib/api';
import NewsArchiveClient from './NewsArchiveClient';

const PAGE_SIZE = 10;

const NEWS_EXCLUDE = ['COURSES', 'GUIDES-TIPS', 'COURSE'];

export default async function NewsPage() {
    let initialArticles: any[] = [];
    let total = 0;

    try {
        // Server-side: fetch first PAGE_SIZE articles, excluding Courses & Guides categories at DB level
        const { data, total: t } = await fetchNews(undefined, undefined, undefined, 0, PAGE_SIZE, NEWS_EXCLUDE);
        initialArticles = data ?? [];
        total = t ?? 0;
    } catch (error) {
        console.error('Error loading news archive:', error);
    }

    return (
        <NewsArchiveClient
            initialArticles={initialArticles}
            pageSize={PAGE_SIZE}
            serverTotal={total}
        />
    );
}
