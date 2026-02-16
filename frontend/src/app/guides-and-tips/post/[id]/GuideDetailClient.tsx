'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import JsonLd, { createArticleJsonLd } from '@/components/JsonLd';
import styles from './GuideDetail.module.css';

interface GuideDetailClientProps {
    id: string;
    initialArticle: any;
    initialRelated: any[];
}

export default function GuideDetailClient({
    id,
    initialArticle,
    initialRelated,
}: GuideDetailClientProps) {
    const [article] = useState<any>(initialArticle);
    const [relatedGuides] = useState<any[]>(initialRelated);

    if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Guide not found.</div>;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

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
                url: `${SITE_URL}/guides-and-tips/post/${id}`,
            })} />

            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link href="/guides-and-tips">Guides &amp; Tips</Link>
                <span className={styles.breadcrumbSep}>›</span>
                <span>{article.categoryTag || 'Guide'}</span>
            </nav>

            <div className={styles.topLayout}>
                {/* Main Content */}
                <main className={styles.mainContent}>
                    <span className={styles.categoryLabel}>{article.categoryTag || article.category}</span>
                    <h1 className={styles.title}>{article.title}</h1>

                    <div className={styles.authorRow}>
                        <div className={styles.publishInfo}>
                            {formatDate(article.createdAt || new Date().toISOString())} • {article.readTime || '5 min read'}
                        </div>
                    </div>

                    <div className={styles.heroImageContainer}>
                        <Image src={article.image} alt={article.title} fill className={styles.heroImage} priority sizes="(max-width: 900px) 100vw, 750px" style={{ objectFit: 'cover' }} />
                    </div>

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
                                {article.content.split('\n').map((para: string, idx: number) => (
                                    <p key={idx}>{para}</p>
                                ))}
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

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Related Guides */}
                    <div className={styles.sidebarSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.accentBar}></div>
                            <h3 className={styles.sectionTitle}>More Guides</h3>
                        </div>
                        <div className={styles.relatedList}>
                            {relatedGuides.slice(0, 5).map((item, i) => (
                                <Link href={`/guides-and-tips/post/${item.id}`} key={i} className={styles.relatedItem}>
                                    <div className={styles.relatedThumbWrapper}>
                                        <Image src={item.image} alt={item.title} fill sizes="70px" className={styles.relatedThumb} />
                                    </div>
                                    <div className={styles.relatedContent}>
                                        <span className={styles.relatedCategory}>{item.categoryTag}</span>
                                        <h4 className={styles.relatedTitle}>{item.title}</h4>
                                        <span className={styles.relatedMeta}>{formatDate(item.createdAt || new Date().toISOString())}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>


                </aside>
            </div>

            {/* Bottom: More Guides */}
            {relatedGuides.length > 5 && (
                <div className={styles.bottomRelated}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.accentBar}></div>
                        <h3 className={styles.sectionTitle}>More from Guides &amp; Tips</h3>
                    </div>

                    <div className={styles.bottomGrid}>
                        {relatedGuides.slice(5, 13).map((item, i) => (
                            <Link href={`/guides-and-tips/post/${item.id}`} key={i} className={styles.bottomCard}>
                                <div className={styles.bottomCardThumbWrapper}>
                                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 600px) 240px, 300px" className={styles.bottomCardThumb} />
                                    <span className={styles.bottomCardTag}>{item.categoryTag}</span>
                                </div>
                                <div className={styles.bottomCardContent}>
                                    <h4 className={styles.bottomCardTitle}>{item.title}</h4>
                                    <div className={styles.bottomCardMeta}>
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
