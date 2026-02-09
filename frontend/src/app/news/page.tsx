'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchNews } from '@/lib/api';
import styles from './news.module.css';

export default function NewsPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchNews();
                setArticles(data);
            } catch (err) {
                console.error('Error loading news:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const featured = articles.find(a => a.type === 'FEATURED');
    const regular = articles.filter(a => a.type !== 'FEATURED');

    if (loading) return <div className={styles.loading}>Loading News Archive...</div>;

    return (
        <div className={`container ${styles.container}`}>


            <div className={styles.mainGrid}>
                <div className={styles.content}>
                    {featured && (
                        <Link href={`/news/${featured.id}`} className={styles.featuredStory}>
                            <div
                                className={styles.featuredImage}
                                style={{ backgroundImage: `url(${featured.image})` }}
                            />
                            <div className={styles.featuredContent}>
                                <div className={styles.meta}>
                                    <span className={styles.category}>{featured.category}</span>
                                    <span className={styles.time}>{featured.time}</span>
                                </div>
                                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                                <p className={styles.excerpt}>{featured.excerpt}</p>
                                <div className={styles.readMore}>
                                    Read Full Analysis <span>→</span>
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className={styles.articleList}>
                        {regular.map(article => (
                            <Link href={`/news/${article.id}`} key={article.id} className={styles.articleCard}>
                                <div
                                    className={styles.articleImage}
                                    style={{ backgroundImage: `url(${article.image})` }}
                                >
                                    <span className={styles.tag}>{article.categoryTag}</span>
                                </div>
                                <div className={styles.articleBody}>
                                    <div className={styles.articleMeta}>
                                        <span className={styles.articleCategory}>{article.category}</span>
                                        <span className={styles.articleTime}>• {article.time}</span>
                                    </div>
                                    <h3 className={styles.articleTitle}>{article.title}</h3>
                                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                                    <div className={styles.author}>
                                        <img src={article.author?.image} alt={article.author?.name} className={styles.authorImg} />
                                        <span className={styles.authorName}>By {article.author?.name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className={styles.loadMore}>
                        <button className={styles.loadMoreBtn}>
                            Load More Articles <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.filterBox}>
                        <div className={styles.filterHeader}>
                            <h3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="21" y2="21" /><line x1="4" x2="20" y1="14" y2="14" /><line x1="4" x2="20" y1="7" y2="7" /></svg> Filters</h3>
                            <span className={styles.reset}>Reset All</span>
                        </div>

                        <div className={styles.filterGroup}>
                            <span className={styles.groupLabel}>Search Archive</span>
                            <div className={styles.searchWrapper}>
                                <span className={styles.searchIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </span>
                                <input type="text" className={styles.searchInput} placeholder="Keywords, players..." />
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <span className={styles.groupLabel}>Categories</span>
                            <div className={styles.categoryList}>
                                {[
                                    { name: 'All News', count: 124, active: true },
                                    { name: 'PGA Tour', count: 48 },
                                    { name: 'LIV Golf', count: 22 },
                                    { name: 'Gear & Equipment', count: 15 },
                                    { name: 'Instruction', count: 8 },
                                    { name: 'Opinion', count: 12 },
                                ].map(cat => (
                                    <div key={cat.name} className={styles.categoryItem}>
                                        <div className={styles.catLeft}>
                                            <div className={`${styles.checkbox} ${cat.active ? styles.activeCheckbox : ''}`} />
                                            <span>{cat.name}</span>
                                        </div>
                                        <span className={styles.count}>{cat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <span className={styles.groupLabel}>Date Range</span>
                            <div className={styles.dateRange}>
                                <select>
                                    <option>Any Time</option>
                                    <option>Past 24 Hours</option>
                                    <option>Past Week</option>
                                    <option>Past Month</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.popularSection}>
                        <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m19 12-7 7-7-7" /><path d="M12 19V5" /></svg> Popular Right Now</h3>
                        <div className={styles.popularList}>
                            {[
                                "Tiger Woods Spotted Testing New Bridgestone Prototype Ball",
                                "LIV Golf Negotiation Update: What We Know So Far",
                                "Why Rory McIlroy Changed His Putting Grip Mid-Tournament"
                            ].map((title, i) => (
                                <div key={i} className={styles.popularItem}>
                                    <span className={styles.popRank}>{i + 1}</span>
                                    <p className={styles.popTitle}>{title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
