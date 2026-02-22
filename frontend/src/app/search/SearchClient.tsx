'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import styles from './search.module.css';

// Directly fetch paginated news on the client
async function clientFetchSearchNews(params: {
    skip: number;
    take: number;
    search: string;
}): Promise<{ data: any[]; total: number }> {
    const query = new URLSearchParams();
    query.append('search', params.search);
    query.append('skip', String(params.skip));
    query.append('take', String(params.take));
    const res = await fetch(`${API_BASE_URL}/news?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch search results');

    const json = await res.json();

    if (Array.isArray(json)) {
        return { data: json, total: json.length };
    }
    return {
        data: Array.isArray(json.data) ? json.data : [],
        total: typeof json.total === 'number' ? json.total : (json.data?.length ?? 0),
    };
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';

    const pageSize = 10;
    const [articles, setArticles] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!q) {
            setArticles([]);
            setTotal(0);
            setHasSearched(true);
            return;
        }

        setLoading(true);
        clientFetchSearchNews({ skip: 0, take: pageSize, search: q })
            .then(({ data, total: t }) => {
                setArticles(data);
                setTotal(t);
                setHasSearched(true);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [q, pageSize]);

    const handleLoadMore = useCallback(async () => {
        setLoadingMore(true);
        try {
            const { data } = await clientFetchSearchNews({
                skip: articles.length,
                take: pageSize,
                search: q,
            });
            setArticles(prev => [...prev, ...data]);
        } catch (err) {
            console.error('Load more failed:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [articles.length, pageSize, q]);

    const hasMore = articles.length < total && articles.length > 0;

    if (loading && !hasSearched) return <div className={`container ${styles.container}`}><div className={styles.loading}>Searching...</div></div>;

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.headerRow}>
                <h1 className={styles.pageTitle}>
                    {q ? `SEARCH RESULTS FOR: ${q}` : 'SEARCH'}
                </h1>
            </div>

            {articles.length === 0 && hasSearched && (
                <div className={styles.noArticles}>
                    {q ? `No articles found for "${q}".` : 'Enter a search term to find articles.'}
                </div>
            )}

            {articles.length > 0 && (
                <div>
                    <div className={styles.searchGrid}>
                        {articles.map((article: any) => (
                            <Link href={`/news/${article.id}`} key={article.id} className={styles.searchItem}>
                                <div
                                    className={styles.searchThumb}
                                    style={{ backgroundImage: `url(${article.image})` }}
                                >
                                    <div className={styles.overlayContent}>
                                        <div className={styles.overlayText}>
                                            <div className={styles.searchMetaOverlay}>
                                                <span className={styles.searchCategory}>{article.category}</span>
                                                <span className={styles.searchTime}>{article.time}</span>
                                            </div>
                                            <h3 className={styles.searchTitle}>{article.title}</h3>
                                        </div>
                                        <div className={styles.searchArrow}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {hasMore && (
                        <div className={styles.loadMore}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : 'Load More Results'}
                            </button>
                            <span className={styles.articleCount}>
                                Showing {articles.length} of {total} results
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchClient() {
    return (
        <Suspense fallback={<div className="container">Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}
