'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './lifestyle.module.css';
import { fetchNews } from '@/lib/api';

interface LifestyleArticle {
    id: string;
    title: string;
    image: string;
    excerpt: string;
    categoryTag?: string;
    author?: string;
    time?: string;
    createdAt?: string;
}

const GOLDEN_PUTTER_IMG = 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png';

interface LifestyleCategory {
    id: string;
    name: string;
    image?: string | null;
    _count?: {
        news: number;
    };
}

export default function LifestyleClient({ initialArticles }: { initialArticles: any[] }) {
    const [articles, setArticles] = useState<LifestyleArticle[]>(initialArticles);
    const [categories, setCategories] = useState<LifestyleCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialArticles.length >= 10);
    const [offset, setOffset] = useState(initialArticles.length);

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Categories to get Lifestyle sub-tags
                const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/golf/categories`);
                if (catRes.ok) {
                    const allCats = await catRes.json();
                    const lifestyleCat = allCats.find((c: any) => c.slug === 'lifestyle' || c.name.toLowerCase() === 'lifestyle');
                    if (lifestyleCat && lifestyleCat.subTags) {
                        setCategories(lifestyleCat.subTags);
                    }
                }

                // 2. Fetch Latest Articles if not provided
                if (!initialArticles || initialArticles.length === 0) {
                    const { data } = await fetchNews('LIFESTYLE', undefined, undefined, 0, 10);
                    if (data && data.length > 0) {
                        setArticles(data);
                        setOffset(data.length);
                        setHasMore(data.length >= 10);
                    }
                }
            } catch (e) {
                console.error('Failed to load lifestyle data', e);
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
            const { data } = await fetchNews('LIFESTYLE', undefined, undefined, offset, 10);
            if (data && data.length > 0) {
                setArticles(prev => [...prev, ...data]);
                setOffset(prev => prev + data.length);
                setHasMore(data.length >= 10);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more lifestyle articles:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section - Elegance and Style */}
            <section className={styles.hero} style={{ backgroundImage: `url(${GOLDEN_PUTTER_IMG})` }}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Aesthetic & Life</h1>
                    <p className={styles.heroSubtitle}>CULTIVATING THE ART OF THE GOLF LIFESTYLE</p>
                    <div className={styles.heroBadge}>FASHION • TRAVEL • LUXURY</div>
                </div>
            </section>

            {/* Lifestyle Pillars */}
            <section className={styles.categorySection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.redLine}></div>
                    <h2 className={styles.sectionTitle}>Explore the Lifestyle</h2>
                </div>
                <div className={styles.categoryGrid}>
                    {categories.length > 0 ? (
                        categories.map((cat, idx) => (
                            <Link key={cat.id || idx} href={`/news?category=LIFESTYLE&tag=${cat.name.toLowerCase().replace(/ /g, '-')}`} className={styles.categoryCard}>
                                <Image
                                    src={cat.image || GOLDEN_PUTTER_IMG}
                                    alt={cat.name}
                                    fill
                                    className={styles.categoryImage}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className={styles.categoryOverlay}>
                                    <h3 className={styles.categoryName}>{cat.name}</h3>
                                    <span className={styles.categoryCount}>{cat._count?.news || 0} Stories</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        // Fallback pillars if no sub-tags in DB
                        ['Fashion & Apparel', 'Luxury Travel', 'Accessories', 'Art & Culture'].map((name, idx) => (
                            <div key={idx} className={styles.categoryCard}>
                                <Image
                                    src={GOLDEN_PUTTER_IMG}
                                    alt={name}
                                    fill
                                    className={styles.categoryImage}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className={styles.categoryOverlay}>
                                    <h3 className={styles.categoryName}>{name}</h3>
                                    <span className={styles.categoryCount}>Explore Soon</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Latest Content */}
            <section className={styles.articlesSection}>
                <div className={styles.articlesInner}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.redLine}></div>
                        <h2 className={styles.sectionTitle}>The Latest Stories</h2>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading elegance...</div>
                    ) : (
                        <div className={styles.articlesGrid}>
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <Link key={article.id} href={`/lifestyle/${article.id}`} className={styles.articleCard}>
                                        <div className={styles.articleImageWrapper}>
                                            <Image src={article.image} alt={article.title} fill className={styles.articleImage} sizes="(max-width: 768px) 100vw, 33vw" />
                                            <div className={styles.cardOverlay}></div>
                                        </div>
                                        <div className={styles.articleContent}>
                                            <span className={styles.articleTag}>{article.categoryTag || 'LIFESTYLE'}</span>
                                            <h3 className={styles.articleTitle}>{article.title}</h3>
                                            <p className={styles.articleExcerpt}>{article.excerpt}</p>
                                            <div className={styles.articleMeta}>
                                                <span className={styles.author}>{article.author?.toUpperCase() || 'THE GOLF PRESS'}</span>
                                                <span className={styles.dot}></span>
                                                <span className={styles.date}>{article.time || (article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                // Elegant placeholder if nothing in DB
                                [1, 2, 3].map((_, idx) => (
                                    <Link key={idx} href="/lifestyle" className={styles.articleCard}>
                                        <div className={styles.articleImageWrapper}>
                                            <Image src={GOLDEN_PUTTER_IMG} alt="Mock" fill className={styles.articleImage} sizes="(max-width: 768px) 100vw, 33vw" />
                                        </div>
                                        <div className={styles.articleContent}>
                                            <span className={styles.articleTag}>LUXURY DESTINATIONS</span>
                                            <h3 className={styles.articleTitle}>Beyond the Fairway: The World's Most Exclusive Golf Retreats</h3>
                                            <p className={styles.articleExcerpt}>From the cliffs of Scotland to the tropical shores of the Caribbean, we explore the destinations that define the pinnacle of golf luxury.</p>
                                            <div className={styles.articleMeta}>BY THE GOLF PRESS • FEB 22, 2026</div>
                                        </div>
                                    </Link>
                                ))
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
                                {loadingMore ? 'LOADING...' : 'LOAD MORE ARTICLES'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
