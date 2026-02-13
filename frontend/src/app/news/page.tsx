import { fetchNews } from '@/lib/api';
import NewsArchiveClient from './NewsArchiveClient';

export default async function NewsPage() {
    let articles: any[] = [];

    try {
        const data = await fetchNews();
        // Filter out Guides & Tips and Courses from news archive
        articles = data.filter((a: any) => {
            const cat = (a.category || '').toUpperCase();
            return cat !== 'GUIDES-TIPS' && cat !== 'COURSES' && cat !== 'COURSE';
        });
    } catch (error) {
        console.error('Error loading news archive:', error);
    }

    return <NewsArchiveClient initialArticles={articles} />;
}
