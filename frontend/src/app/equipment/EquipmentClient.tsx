'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './equipment.module.css';
import { fetchNews, API_BASE_URL } from '@/lib/api';

interface EquipmentArticle {
    id: string;
    title: string;
    image: string;
    excerpt: string;
    categoryTag?: string;
    author?: string;
    time?: string;
    createdAt?: string;
}

interface EquipmentCategory {
    id: string;
    name: string;
    image?: string | null;
    _count?: {
        news: number;
    };
}

export default function EquipmentClient({ initialArticles }: { initialArticles: any[] }) {
    const [articles, setArticles] = useState<EquipmentArticle[]>(initialArticles);
    const [categories, setCategories] = useState<EquipmentCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialArticles.length >= 10);
    const [offset, setOffset] = useState(initialArticles.length);

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            try {
                const catRes = await fetch(`${API_BASE_URL}/categories`);
                if (catRes.ok) {
                    const allCats = await catRes.json();
                    const equipmentCat = allCats.find((c: any) => c.slug === 'equipment' || c.name.toLowerCase() === 'equipment');
                    if (equipmentCat && equipmentCat.subTags) {
                        setCategories(equipmentCat.subTags);
                    }
                }

                // 2. Fetch Latest Articles if not provided
                if (!initialArticles || initialArticles.length === 0) {
                    const { data } = await fetchNews('EQUIPMENT', undefined, undefined, 0, 10);
                    if (data && data.length > 0) {
                        setArticles(data);
                        setOffset(data.length);
                        setHasMore(data.length >= 10);
                    }
                }
            } catch (e) {
                console.error('Failed to load equipment data', e);
            } finally {
                setLoading(false);
            }
        };

        loadPageData();
    }, [initialArticles]);

    const handleLoadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const { data } = await fetchNews('EQUIPMENT', undefined, undefined, offset, 10);
            if (data && data.length > 0) {
                setArticles(prev => [...prev, ...data]);
                setOffset(prev => prev + data.length);
                setHasMore(data.length >= 10);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more equipment articles:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>The Gear Room</h1>
                    <p className={styles.heroSubtitle}>EXPERT REVIEWS • TECH BREAKDOWNS • REAL WORLD TESTING</p>
                </div>
            </section>

            {/* Shop by Category */}
            <section className={styles.categorySection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.redBar}></div>
                    <h2 className={styles.sectionTitle}>Shop by Category</h2>
                </div>
                <div className={styles.categoryGrid}>
                    {categories.length > 0 ? (
                        categories.map((cat, idx) => (
                            <Link key={cat.id || idx} href={`/news?category=EQUIPMENT&tag=${cat.name.toLowerCase().replace(/ /g, '-')}`} className={styles.categoryCard}>
                                <Image
                                    src={cat.image || `https://images.unsplash.com/photo-1592910710304-a161db93d03b?auto=format&fit=crop&q=80&w=800&sig=${idx}`}
                                    alt={cat.name}
                                    fill
                                    className={styles.categoryImage}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className={styles.categoryOverlay}>
                                    <h3 className={styles.categoryName}>{cat.name}</h3>
                                    <span className={styles.categoryCount}>{cat._count?.news || 0} Articles</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ padding: '20px', color: '#666' }}>No equipment categories configured.</div>
                    )}
                </div>
            </section>

            {/* Latest Reviews */}
            <section className={styles.reviewsSection}>
                <div className={styles.reviewsInner}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.redBar}></div>
                        <h2 className={styles.sectionTitle}>Latest Reviews & Gear News</h2>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                    ) : (
                        <div className={styles.articlesGrid}>
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <Link key={article.id} href={`/equipment/${article.id}`} className={styles.articleCard}>
                                        <div className={styles.articleImageWrapper}>
                                            <Image src={article.image} alt={article.title} fill className={styles.articleImage} sizes="(max-width: 768px) 100vw, 33vw" />
                                        </div>
                                        <div className={styles.articleContent}>
                                            <span className={styles.articleTag}>{article.categoryTag || 'EQUIPMENT'}</span>
                                            <h3 className={styles.articleTitle}>{article.title}</h3>
                                            <p className={styles.articleExcerpt}>{article.excerpt}</p>
                                            <div className={styles.articleMeta}>
                                                BY {article.author?.toUpperCase() || 'THE GOLF PRESS'} • {article.time || (article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '')}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div style={{ padding: '40px', color: '#888', textAlign: 'center', gridColumn: '1 / -1' }}>No equipment articles found.</div>
                            )}
                        </div>
                    )}

                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'LOADING...' : 'LOAD MORE GEAR'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
