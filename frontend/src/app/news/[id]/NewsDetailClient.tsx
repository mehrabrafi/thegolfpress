'use client';

import { useEffect, useState } from 'react';
import { fetchNewsById, fetchNews, fetchTrendingNews } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import JsonLd, { createArticleJsonLd } from '@/components/JsonLd';
import ShareButtons from '@/components/ShareButtons';
import styles from './NewsDetail.module.css';

interface NewsDetailClientProps {
    id: string;
    initialArticle: any;
    initialRelated: any[];
    initialTrending: any[];
}

export default function NewsDetailClient({
    id,
    initialArticle,
    initialRelated,
    initialTrending,
}: NewsDetailClientProps) {
    const [article] = useState<any>(initialArticle);
    const [relatedNews] = useState<any[]>(initialRelated);
    const [trendingNews, setTrendingNews] = useState<any[]>(initialTrending);
    const [trendingTitle, setTrendingTitle] = useState('Trending Now');

    useEffect(() => {
        // Compute trending title based on category
        const categoryRaw = article?.category || article?.categoryTag;
        const categoryFetch = categoryRaw ? categoryRaw.toUpperCase() : undefined;

        if (relatedNews.length > 5 && categoryRaw) {
            setTrendingNews(relatedNews.slice(5, 13));
            setTrendingTitle(categoryFetch === 'COURSES' ? 'More Courses' : `More from ${categoryRaw}`);
        }
    }, [article, relatedNews]);

    if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Article not found.</div>;

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const categoryRaw = article.category || article.categoryTag;
    const isCourse = categoryRaw && (categoryRaw.toUpperCase() === 'COURSES' || categoryRaw.toUpperCase() === 'COURSE');
    const mapQuery = encodeURIComponent(`${article.title} Golf Course`);

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';

    return (
        <div className={styles.pageContainer}>
            <JsonLd data={createArticleJsonLd({
                title: article.title,
                description: article.excerpt || article.title,
                image: article.image,
                datePublished: article.createdAt || new Date().toISOString(),
                dateModified: article.updatedAt || article.createdAt || new Date().toISOString(),
                authorName: article.author?.name || 'The Golf Press Editorial',
                url: `${SITE_URL}/news/${id}`,
            })} />
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
                        <Image src={article.image} alt={article.title} fill className={styles.heroImage} priority sizes="(max-width: 1100px) 100vw, 900px" style={{ objectFit: 'cover' }} />
                    </div>
                    <p className={styles.imageCaption}>{article.title} - Photo by The Golf Press</p>

                    <div className={styles.articleBody}>
                        {article.content.trim().startsWith('<') ? (
                            <div dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(article.content, {
                                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                                    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel', 'width', 'height'],
                                })
                            }} />
                        ) : (
                            <>
                                <p>AUGUSTA, Ga. — {article.excerpt}</p>
                                {article.content.split('\n').map((para: string, idx: number) => {
                                    if (idx === 1) {
                                        return (
                                            <div key={idx}>
                                                <p>{para}</p>
                                                <div className={styles.quoteBlock}>
                                                    &quot;This is a dream come true for my family. I can&apos;t describe the feeling of wearing this jacket again.&quot;
                                                </div>
                                            </div>
                                        )
                                    }
                                    if (idx === 2) {
                                        return (
                                            <div key={idx}>
                                                <p>{para}</p>
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

                    <ShareButtons title={article.title} url={`${SITE_URL}/news/${id}`} />
                </main>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    {isCourse ? (
                        <div className={styles.sidebarSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.greenBar}></div>
                                <h2 className={styles.sectionTitle}>Course Map</h2>
                            </div>
                            <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <iframe
                                    width="100%"
                                    height="400"
                                    frameBorder="0"
                                    style={{ border: 0, display: 'block' }}
                                    src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                    allowFullScreen
                                    loading="lazy"
                                    title={`Map of ${article.title}`}
                                ></iframe>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.sidebarSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.greenBar}></div>
                                <h2 className={styles.sectionTitle}>Related Coverage</h2>
                            </div>
                            <div className={styles.trendingList}>
                                {relatedNews.slice(0, 5).map((item, i) => (
                                    <Link href={`/news/${item.id}`} key={i} className={styles.trendingItem}>
                                        <div className={styles.trendingThumbWrapper}>
                                            <Image src={item.image} alt={item.title} fill sizes="60px" className={styles.trendingThumb} />
                                        </div>
                                        <div className={styles.trendingContent}>
                                            <span className={styles.trendingCategory}>{item.category}</span>
                                            <h3 className={styles.trendingTitle}>{item.title}</h3>
                                            <span className={styles.trendingMeta}>{formatDate(item.createdAt || new Date().toISOString())}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Trending Now (Bottom) - Hide for Courses */}
            {!isCourse && (
                <div className={styles.bottomRelated}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.greenBar}></div>
                        <h2 className={styles.sectionTitle}>{trendingTitle}</h2>
                    </div>

                    <div className={styles.trendingGrid}>
                        {trendingNews.slice(0, 8).map((item, i) => (
                            <Link href={`/news/${item.id}`} key={i} className={styles.trendingCard}>
                                <div className={styles.trendingCardThumbWrapper}>
                                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 600px) 280px, 320px" className={styles.trendingCardThumb} />
                                    <span className={styles.trendingCardTag}>{item.category}</span>
                                </div>
                                <div className={styles.trendingCardContent}>
                                    <h3 className={styles.trendingCardTitle}>{item.title}</h3>
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
