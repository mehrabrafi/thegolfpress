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

            <div className={styles.mainGrid}>
                <div className={styles.content}>

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
                    <div className={styles.latestSection}>
                        <h3>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d0021b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Latest News
                        </h3>
                        <div className={styles.latestList}>
                            {articles
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .slice(0, 5)
                                .map((article) => (
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
