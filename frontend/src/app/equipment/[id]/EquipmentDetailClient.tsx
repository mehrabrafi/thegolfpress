'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { ShoppingBag } from 'lucide-react';
import JsonLd, { createArticleJsonLd } from '@/components/JsonLd';
import ShareButtons from '@/components/ShareButtons';
import styles from './EquipmentDetail.module.css';

interface EquipmentDetailClientProps {
    id: string;
    initialArticle: any;
    initialRelated: any[];
}

export default function EquipmentDetailClient({
    id,
    initialArticle,
    initialRelated,
}: EquipmentDetailClientProps) {
    const [article] = useState<any>(initialArticle);
    const [related] = useState<any[]>(initialRelated);

    if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Review not found.</div>;

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
                url: `${SITE_URL}/equipment/${id}`,
            })} />

            <div className={styles.header}>
                <nav className={styles.breadcrumb}>
                    <Link href="/equipment">The Gear Room</Link>
                    <span className={styles.sep}>›</span>
                    <span>{article.categoryTag || 'Reviews'}</span>
                </nav>
                <h1 className={styles.title}>{article.title}</h1>
                <div className={styles.authorRow}>
                    <div className={styles.authorInfo}>
                        <div className={styles.avatarWrapper}>
                            <Image src="/logo.png" alt="TGP" width={40} height={40} className={styles.avatar} />
                        </div>
                        <div className={styles.authorMetadata}>
                            <span className={styles.authorName}>By {article.author || 'The Golf Press Editorial'}</span>
                            <span className={styles.publishDate}>{formatDate(article.createdAt)} • {article.readTime || '6 min read'}</span>
                        </div>
                    </div>
                    <ShareButtons title={article.title} url={`${SITE_URL}/equipment/${id}`} />
                </div>
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.contentColumn}>
                    <div className={styles.heroImageContainer}>
                        <Image src={article.image} alt={article.imageAlt || article.title} fill className={styles.heroImage} priority sizes="(max-width: 1000px) 100vw, 850px" />
                    </div>

                    {article.affiliateLink && (
                        <div className={styles.buyButtonWrapper}>
                            <a
                                href={article.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.buyButton}
                            >
                                <ShoppingBag size={20} />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 800 }}>CHECK PRICE</span>
                                </div>
                            </a>
                        </div>
                    )}

                    <div className={styles.articleBody}>
                        {article.content.trim().startsWith('<') ? (
                            <div dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(article.content)
                            }} />
                        ) : (
                            article.content.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)
                        )}
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.sidebarWidget}>
                        <h2 className={styles.widgetTitle}>Latest Gear Reviews</h2>
                        <div className={styles.relatedList}>
                            {related.slice(0, 5).map((item) => (
                                <Link href={`/equipment/${item.id}`} key={item.id} className={styles.relatedCard}>
                                    <div className={styles.relatedThumb}>
                                        <Image src={item.image} alt={item.title} fill sizes="80px" />
                                    </div>
                                    <div className={styles.relatedInfo}>
                                        <h3>{item.title}</h3>
                                        <span>{formatDate(item.createdAt)}</span>
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
