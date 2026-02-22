'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import styles from './news.module.css';

interface NewsArchiveClientProps {
    initialArticles: any[];
    pageSize: number;
    serverTotal: number;
}

const NEWS_EXCLUDE = ['COURSES', 'GUIDES-TIPS', 'COURSE'];

// Directly fetch paginated news on the client (bypasses Next.js cache for fresh data)
async function clientFetchNews(params: {
    skip: number;
    take: number;
    tag?: string;
}): Promise<{ data: any[]; total: number }> {
    const query = new URLSearchParams();
    if (params.tag) query.append('tag', params.tag);
    query.append('skip', String(params.skip));
    query.append('take', String(params.take));
    query.append('excludeCategories', NEWS_EXCLUDE.join(','));
    const res = await fetch(`${API_BASE_URL}/news?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch news');

    const json = await res.json();

    // Normalize both old (array) and new ({ data, total }) backend formats
    if (Array.isArray(json)) {
        return { data: json, total: json.length };
    }
    return {
        data: Array.isArray(json.data) ? json.data : [],
        total: typeof json.total === 'number' ? json.total : (json.data?.length ?? 0),
    };
}

function NewsPageContent({ initialArticles, pageSize, serverTotal }: NewsArchiveClientProps) {
    const [articles, setArticles] = useState<any[]>(initialArticles);
    const [total, setTotal] = useState<number>(serverTotal);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const searchParams = useSearchParams();
    const tag = searchParams.get('tag');

    // যখন tag filter বদলায়, নতুন করে প্রথম page load করো
    useEffect(() => {
        if (!tag) {
            // No tag: server data ব্যবহার করো
            setArticles(initialArticles);
            setTotal(serverTotal);
            return;
        }

        // Tag আছে: client-side থেকে fetch করো
        setLoading(true);
        clientFetchNews({ skip: 0, take: pageSize, tag })
            .then(({ data, total: t }) => {
                setArticles(data);
                setTotal(t);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [tag, initialArticles, serverTotal, pageSize]);

    const handleLoadMore = useCallback(async () => {
        setLoadingMore(true);
        try {
            const { data } = await clientFetchNews({
                skip: articles.length,
                take: pageSize,
                tag: tag || undefined,
            });
            setArticles(prev => [...prev, ...data]);
        } catch (err) {
            console.error('Load more failed:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [articles.length, pageSize, tag]);

    // সব filtered articles কি load হয়েছে?
    // total থেকে GUIDES-TIPS/COURSES ফিল্টার হয় — তাই hasMore check এর জন্য আমরা articles.length ভিত্তিক
    const hasMore = articles.length < total && articles.length > 0;

    // Sidebar এর জন্য সবসময় initialArticles থেকে latest নেওয়া হয় (server-side)
    const latestSidebarArticles = [...initialArticles]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    if (loading) return <div className={styles.loading}>Loading News Archive...</div>;

    return (
        <div className={`container ${styles.container}`}>

            <div className={styles.headerRow}>
                <h1 className={styles.pageTitle}>
                    {tag ? `News: ${tag.replace(/-/g, ' ').toUpperCase()}` : 'News Archive'}
                </h1>
            </div>

            {articles.length === 0 && (
                <div className={styles.noArticles}>
                    No articles found in this section.
                </div>
            )}

            <div className={styles.mainGrid}>
                <div className={styles.content}>

                    <div className={styles.articleList}>
                        {articles.map(article => {
                            const category = (article.category || article.categoryTag || '').toUpperCase();
                            const isCourse = category === 'COURSES';
                            const isEquipment = category === 'EQUIPMENT';
                            const isLifestyle = category === 'LIFESTYLE';
                            const isGuide = category === 'GUIDES-TIPS';

                            let href = `/news/${article.id}`;
                            if (isCourse) href = `/courses/${article.id}`;
                            else if (isEquipment) href = `/equipment/${article.id}`;
                            else if (isLifestyle) href = `/lifestyle/${article.id}`;
                            else if (isGuide) href = `/guides-and-tips/post/${article.id}`;

                            return (
                                <Link href={href} key={article.id} className={styles.articleCard}>
                                    <div
                                        className={styles.articleImage}
                                        style={{ backgroundImage: `url(${article.image})` }}
                                    >
                                    </div>
                                    <div className={styles.articleBody}>
                                        <div className={styles.articleMeta}>
                                            <span className={styles.authorName}>BY {article.author?.toUpperCase() || 'THE GOLF PRESS'}</span>
                                            <span className={styles.dot}></span>
                                            <span className={styles.articleTime}>{article.time}</span>
                                        </div>
                                        <h3 className={styles.articleTitle}>{article.title}</h3>
                                        <p className={styles.articleExcerpt}>{article.excerpt}</p>

                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {hasMore && (
                        <div className={styles.loadMore}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    'Loading...'
                                ) : (
                                    <>
                                        Load More Articles{' '}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                            <span className={styles.articleCount}>
                                Showing {articles.length} of {total} articles
                            </span>
                        </div>
                    )}
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.latestSection}>
                        <h3>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d0021b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Latest News
                        </h3>
                        <div className={styles.latestList}>
                            {latestSidebarArticles.map((article) => (
                                <Link href={`/news/${article.id}`} key={article.id} className={styles.latestItem}>
                                    <div
                                        className={styles.latestThumb}
                                        style={{ backgroundImage: `url(${article.image})` }}
                                    />
                                    <div className={styles.latestContent}>
                                        <span className={styles.latestTime}>{article.time}</span>
                                        <h4 className={styles.latestTitle}>{article.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function NewsArchiveClient({ initialArticles, pageSize, serverTotal }: NewsArchiveClientProps) {
    return (
        <Suspense fallback={null}>
            <NewsPageContent
                initialArticles={initialArticles}
                pageSize={pageSize}
                serverTotal={serverTotal}
            />
        </Suspense>
    );
}
