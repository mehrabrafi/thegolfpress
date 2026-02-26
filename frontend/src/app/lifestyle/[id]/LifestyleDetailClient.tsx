'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import JsonLd, { createArticleJsonLd } from '@/components/JsonLd';
import ShareButtons from '@/components/ShareButtons';
import styles from './LifestyleDetail.module.css';

interface LifestyleDetailClientProps {
    id: string;
    initialArticle: any;
    initialRelated: any[];
}

export default function LifestyleDetailClient({
    id,
    initialArticle,
    initialRelated,
}: LifestyleDetailClientProps) {
    const [article] = useState<any>(initialArticle);
    const [related] = useState<any[]>(initialRelated);

    if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Story not found.</div>;

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
                authorName: article.author || 'The Golf Press Editorial',
                url: `${SITE_URL}/lifestyle/${id}`,
            })} />

            <div className={styles.header}>
                <div className={styles.badge}>{article.categoryTag || 'LIFESTYLE'}</div>
                <h1 className={styles.title}>{article.title}</h1>
                <div className={styles.metaRow}>
                    <div className={styles.authorSection}>
                        <div className={styles.avatarWrapper}>
                            <Image src="/logo.png" alt="TGP" width={40} height={40} className={styles.avatar} />
                        </div>
                        <div className={styles.authorInfo}>
                            <span className={styles.name}>By {article.author || 'The Golf Press Editorial'}</span>
                            <span className={styles.date}>{formatDate(article.createdAt)}</span>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <ShareButtons minimal title={article.title} url={`${SITE_URL}/lifestyle/${id}`} />
                    </div>
                </div>
            </div>

            <div className={styles.contentLayout}>
                <main className={styles.mainContent}>
                    <div className={styles.heroSection}>
                        <div className={styles.imageWrapper}>
                            <Image src={article.image} alt={article.imageAlt || article.title} fill priority className={styles.heroImage} sizes="(max-width: 1100px) 100vw, 900px" />
                        </div>
                    </div>

                    <div className={styles.articleContent}>
                        <div className={styles.body}>
                            {article.content.trim().startsWith('<') ? (
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                            ) : (
                                article.content.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)
                            )}
                        </div>

                    </div>
                </main>

                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <div className={styles.line}></div>
                        <h2 className={styles.sidebarTitle}>More from Aesthetic & Life</h2>
                    </div>
                    <div className={styles.sidebarStories}>
                        {related.slice(0, 6).map((item) => (
                            <Link href={`/lifestyle/${item.id}`} key={item.id} className={styles.sidebarCard}>
                                <div className={styles.sidebarImage}>
                                    <Image src={item.image} alt={item.title} fill sizes="100px" />
                                </div>
                                <div className={styles.sidebarInfo}>
                                    <h3>{item.title}</h3>
                                    <span>{formatDate(item.createdAt)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
