'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchNewsById, fetchNews, fetchTrendingNews } from '@/lib/api';
import Link from 'next/link';
import styles from './NewsDetail.module.css';

export default function NewsDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [relatedNews, setRelatedNews] = useState<any[]>([]);
    const [trendingNews, setTrendingNews] = useState<any[]>([]);
    const [trendingTitle, setTrendingTitle] = useState('Trending Now');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function loadContent() {
            try {
                // 1. Fetch Article First
                const data = await fetchNewsById(id as string);
                setArticle(data);

                // 2. Fetch Related (same category)
                // If category is available, fetch by category. Otherwise fetch all news.
                const categoryRaw = data.category || data.categoryTag;

                // Normalizing category just in case, though API usually expects exact string
                const categoryFetch = categoryRaw ? categoryRaw.toUpperCase() : undefined;

                // Run fetchNews (by category) and fetchTrendingNews in parallel
                // If we are in 'Courses', we might want "Trending" to also be courses? 
                // Since we don't have fetchTrendingNews(cat), we can simulate it or just show more items from category

                const [categoryNews, globalTrending] = await Promise.all([
                    fetchNews(categoryFetch),
                    fetchTrendingNews()
                ]);

                // Filter out current
                const relevantNews = categoryNews ? categoryNews.filter((n: any) => n.id !== id) : [];

                // Set Related Coverage (Sidebar) - Top 5 relevant
                setRelatedNews(relevantNews.slice(0, 5));

                // Set Trending/More (Bottom) 
                // If it's a specific category like COURSES, user prefers seeing that category
                // So we use more from relevantNews for the bottom section
                // We also check if we actually have a category to show "More from..."
                if (relevantNews.length > 5 && categoryRaw) {
                    setTrendingNews(relevantNews.slice(5, 13));
                    setTrendingTitle(categoryFetch === 'COURSES' ? 'More Courses' : `More from ${categoryRaw}`);
                } else {
                    // Fallback to global trending if not enough category news or no category
                    setTrendingNews(globalTrending);
                    setTrendingTitle('Trending Now');
                }

            } catch (err) {
                console.error('Error loading article:', err);
            } finally {
                setLoading(false);
            }
        }

        loadContent();
    }, [id]);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Article...</div>;
    if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Article not found.</div>;

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Check if the current article is a "Course"
    // We check category or categoryTag against 'COURSES' (case-insensitive usually, but here likely uppercase)
    const categoryRaw = article.category || article.categoryTag;
    const isCourse = categoryRaw && (categoryRaw.toUpperCase() === 'COURSES' || categoryRaw.toUpperCase() === 'COURSE');

    // For map query, use title + " Golf Course" or try to find a location if available
    const mapQuery = encodeURIComponent(`${article.title} Golf Course`);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.topLayout}>
                {/* Left Column: Main Content */}
                <main className={styles.mainContent}>
                    <span className={styles.categoryLabel}>{article.categoryTag || article.category}</span>
                    <h1 className={styles.title}>{article.title}</h1>

                    <div className={styles.authorRow}>
                        <div className={styles.publishInfo}>
                            {formatDate(article.createdAt || new Date().toISOString())} • {article.readTime || '5 min read'}
                        </div>
                    </div>

                    <div className={styles.heroImageContainer}>
                        <img src={article.image} alt={article.title} className={styles.heroImage} />
                    </div>
                    <p className={styles.imageCaption}>{article.title} - Photo by GolfWire Pro</p>

                    <div className={styles.articleBody}>
                        {article.content.trim().startsWith('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        ) : (
                            <>
                                <p>AUGUSTA, Ga. — {article.excerpt}</p>
                                {article.content.split('\n').map((para: string, idx: number) => {
                                    // Injecting components roughly in the middle for demo purposes (e.g. after 2nd paragraph)
                                    // In a real app, this might be parsed from rich text
                                    if (idx === 1) {
                                        return (
                                            <div key={idx}>
                                                <p>{para}</p>
                                                <div className={styles.quoteBlock}>
                                                    "This is a dream come true for my family. I can't describe the feeling of wearing this jacket again."
                                                </div>
                                            </div>
                                        )
                                    }
                                    if (idx === 2) {
                                        return (
                                            <div key={idx}>
                                                <p>{para}</p>
                                                {/* Key Stats Widget */}
                                                <div className={styles.statsBox}>
                                                    <div className={styles.statsHeader}>
                                                        <span className={styles.statsIcon}>📊</span>
                                                        Key Stats: Final Round
                                                    </div>
                                                    <div className={styles.statsGrid}>
                                                        <div className={styles.statItem}>
                                                            <span className={styles.statLabel}>FINAL SCORE</span>
                                                            <span className={styles.statValue}>-11</span>
                                                        </div>
                                                        <div className={styles.statItem}>
                                                            <span className={styles.statLabel}>BIRDIES</span>
                                                            <span className={styles.statValue}>7</span>
                                                        </div>
                                                        <div className={styles.statItem}>
                                                            <span className={styles.statLabel}>DRIVING ACC.</span>
                                                            <span className={styles.statValue}>82%</span>
                                                        </div>
                                                        <div className={styles.statItem}>
                                                            <span className={styles.statLabel}>GREENS IN REG.</span>
                                                            <span className={styles.statValue}>14/18</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return <p key={idx}>{para}</p>
                                })}
                            </>
                        )}
                    </div>

                    <div className={styles.shareSection}>
                        SHARE:
                        <button className={styles.shareBtn}>X</button>
                        <button className={styles.shareBtn}>f</button>
                        <button className={styles.shareBtn}>🔗</button>
                    </div>
                </main>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    {isCourse ? (
                        <div className={styles.sidebarSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.greenBar}></div>
                                <h3 className={styles.sectionTitle}>Course Map</h3>
                            </div>
                            <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <iframe
                                    width="100%"
                                    height="400"
                                    frameBorder="0"
                                    style={{ border: 0, display: 'block' }}
                                    src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    ) : (
                        /* Related Coverage (Standard News Sidebar) */
                        <div className={styles.sidebarSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.greenBar}></div>
                                <h3 className={styles.sectionTitle}>Related Coverage</h3>
                            </div>
                            <div className={styles.trendingList}>
                                {relatedNews.slice(0, 5).map((item, i) => (
                                    <Link href={`/news/${item.id}`} key={i} className={styles.trendingItem}>
                                        <img src={item.image} alt={item.title} className={styles.trendingThumb} />
                                        <div className={styles.trendingContent}>
                                            <span className={styles.trendingCategory}>{item.category}</span>
                                            <h4 className={styles.trendingTitle}>{item.title}</h4>
                                            <span className={styles.trendingMeta}>{formatDate(item.createdAt || new Date().toISOString())}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Trending Now (Now at the Bottom) - Hide for Courses */}
            {!isCourse && (
                <div className={styles.bottomRelated}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.greenBar}></div>
                        <h3 className={styles.sectionTitle}>{trendingTitle}</h3>
                    </div>

                    <div className={styles.trendingGrid}>
                        {trendingNews.slice(0, 8).map((item, i) => (
                            <Link href={`/news/${item.id}`} key={i} className={styles.trendingCard}>
                                <div className={styles.trendingCardThumbWrapper}>
                                    <img src={item.image} alt={item.title} className={styles.trendingCardThumb} />
                                    <span className={styles.trendingCardTag}>{item.category}</span>
                                </div>
                                <div className={styles.trendingCardContent}>
                                    <h4 className={styles.trendingCardTitle}>{item.title}</h4>
                                    <div className={styles.trendingCardMeta}>
                                        <span>{item.viewCount} views</span>
                                        <span>•</span>
                                        <span>{formatDate(item.createdAt || new Date().toISOString())}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
