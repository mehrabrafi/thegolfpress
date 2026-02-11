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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function loadContent() {
            try {
                const [data, allNews, trending] = await Promise.all([
                    fetchNewsById(id as string),
                    fetchNews(),
                    fetchTrendingNews()
                ]);
                setArticle(data);
                // Filter out current article
                const others = allNews.filter((n: any) => n.id !== id);
                setRelatedNews(others.slice(0, 5));
                setTrendingNews(trending);
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

    return (
        <div className={styles.pageContainer}>
            <div className={styles.topLayout}>
                {/* Left Column: Main Content */}
                <main className={styles.mainContent}>
                    <span className={styles.categoryLabel}>{article.categoryTag || article.category}</span>
                    <h1 className={styles.title}>{article.title}</h1>

                    <div className={styles.authorRow}>
                        <div className={styles.authorInfo}>
                            <img
                                src={article.author?.image || 'https://via.placeholder.com/150'}
                                alt={article.author?.name || 'Author'}
                                className={styles.authorAvatar}
                            />
                            <div className={styles.authorText}>
                                <span className={styles.authorName}>{article.author?.name || 'GolfWire Staff'}</span>
                                <span className={styles.authorRole}>Senior Golf Correspondent</span>
                            </div>
                        </div>
                        <div className={styles.publishInfo}>
                            {formatDate(article.createdAt || new Date().toISOString())} • {article.readTime || '5 min read'}
                            {/* Assuming readTime exists or default */}
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
                    {/* Trending Now */}
                    <div className={styles.sidebarSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.greenBar}></div>
                            <h3 className={styles.sectionTitle}>Trending Now</h3>
                        </div>
                        <div className={styles.trendingList}>
                            {trendingNews.slice(0, 5).map((item, i) => (
                                <a href={`/news/${item.id}`} key={i} className={styles.trendingItem}>
                                    <img src={item.image} alt={item.title} className={styles.trendingThumb} />
                                    <div className={styles.trendingContent}>
                                        <span className={styles.trendingCategory}>{item.category}</span>
                                        <h4 className={styles.trendingTitle}>{item.title}</h4>
                                        <span className={styles.trendingMeta}>{item.viewCount} views</span>
                                    </div>
                                </a>
                            ))}
                            <a href="/news" className={styles.viewAllTrending}>
                                View All Trending <span>→</span>
                            </a>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Related Coverage (Outside Grid, Spans Full Width) */}
            <div className={styles.bottomRelated}>
                <div className={styles.sectionHeader}>
                    <div className={styles.greenBar}></div>
                    <h3 className={styles.sectionTitle}>Related Coverage</h3>
                </div>

                <div className={styles.relatedLayout}>
                    {relatedNews.length > 0 && (
                        <div className={styles.relatedFeatured}>
                            <div className={styles.featuredOverlayWrapper}>
                                <img src={relatedNews[0].image} alt={relatedNews[0].title} className={styles.featuredThumb} />
                                <div className={styles.featuredTextOverlay}>
                                    <span className={styles.overlayTag}>{relatedNews[0].category}</span>
                                    <h4 className={styles.overlayTitle}>{relatedNews[0].title}</h4>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.relatedGrid}>
                        {relatedNews.slice(1, 5).map((item, i) => (
                            <Link href={`/news/${item.id}`} key={i} className={styles.relatedCard}>
                                <img src={item.image} alt={item.title} className={styles.relatedCardThumb} />
                                <div className={styles.relatedCardContent}>
                                    <span className={styles.relatedCardTag}>{item.category}</span>
                                    <h4 className={styles.relatedCardTitle}>{item.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
