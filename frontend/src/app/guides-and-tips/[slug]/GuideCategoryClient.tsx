'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api';
import styles from '../Guides.module.css';

interface GuideCategoryClientProps {
    initialArticles: any[];
    pageSize: number;
    serverTotal: number;
    currentTagName: string;
    tagFilter: string;
}

async function clientFetchGuides(params: {
    skip: number;
    take: number;
    tag: string;
}): Promise<{ data: any[]; total: number }> {
    const query = new URLSearchParams();
    query.append('category', 'GUIDES-TIPS');
    if (params.tag) query.append('tag', params.tag);
    query.append('skip', String(params.skip));
    query.append('take', String(params.take));

    const res = await fetch(`${API_BASE_URL}/news?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch guides');

    const json = await res.json();

    if (Array.isArray(json)) {
        return { data: json, total: json.length };
    }
    return {
        data: Array.isArray(json.data) ? json.data : [],
        total: typeof json.total === 'number' ? json.total : (json.data?.length ?? 0),
    };
}

export default function GuideCategoryClient({
    initialArticles,
    pageSize,
    serverTotal,
    currentTagName,
    tagFilter,
}: GuideCategoryClientProps) {
    const [articles, setArticles] = useState<any[]>(initialArticles);
    const [total, setTotal] = useState<number>(serverTotal);
    const [loadingMore, setLoadingMore] = useState(false);

    const hasMore = articles.length < total && articles.length > 0;

    const handleLoadMore = useCallback(async () => {
        setLoadingMore(true);
        try {
            const { data, total: t } = await clientFetchGuides({
                skip: articles.length,
                take: pageSize,
                tag: tagFilter,
            });
            setArticles(prev => [...prev, ...data]);
            setTotal(t);
        } catch (err) {
            console.error('Load more failed:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [articles.length, pageSize, tagFilter]);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.guidesContainer} style={{ paddingTop: '40px' }}>
                <div className={styles.categoryHeader}>
                    <h2 className={styles.sectionTitle}>{currentTagName}</h2>
                </div>

                {articles.length > 0 ? (
                    <>
                        <div className={styles.sectionGrid}>
                            {articles.map((item: any) => (
                                <Link href={`/guides-and-tips/post/${item.id}`} key={item.id} className={styles.articleCard}>
                                    <div className={styles.articleImageWrapper}>
                                        <Image src={item.image} alt={item.title} fill className={styles.articleImage} sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 400px" />
                                    </div>
                                    <div className={styles.articleInfo}>
                                        <h3 className={styles.articleTitle}>{item.title}</h3>
                                        <p className={styles.articleExcerpt}>{item.excerpt}</p>
                                        <div className={styles.articleMeta}>
                                            BY {item.author?.toUpperCase() || 'THE GOLF PRESS'} • PUBLISHED {item.time?.toUpperCase() || (item.createdAt ? new Date(item.createdAt).toLocaleDateString().toUpperCase() : '')}
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
                    </>
                ) : (
                    <div className={styles.noArticles}>
                        No articles found for this section yet.
                    </div>
                )}
            </div>
        </div>
    );
}
