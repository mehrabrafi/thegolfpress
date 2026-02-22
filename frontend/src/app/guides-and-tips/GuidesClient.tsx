'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Guides.module.css';

interface GuidesClientProps {
    guideArticles: any[];
    subTags: any[];
}

const Section = ({ title, items, categoryTag }: { title: string, items: any[], categoryTag: string }) => (
    <section className={styles.categorySection}>
        <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <Link href={`/guides-and-tips/${categoryTag.toLowerCase().replace(' ', '-')}`} className={styles.viewAllLink}>
                View All
            </Link>
        </div>
        <div className={styles.sectionGrid}>
            {items.slice(0, 3).map(item => (
                <Link href={`/guides-and-tips/post/${item.id}`} key={item.id} className={styles.articleCard}>
                    <div className={styles.articleImageWrapper}>
                        <Image src={item.image} alt={item.title} fill className={styles.articleImage} sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw" />
                    </div>
                    <div className={styles.articleInfo}>
                        <h3 className={styles.articleTitle}>{item.title}</h3>
                        <p className={styles.articleExcerpt}>{item.excerpt}</p>
                        <div className={styles.articleMeta}>
                            BY {item.author?.toUpperCase() || 'THE GOLF PRESS'} • PUBLISHED {item.time?.toUpperCase() || (item.createdAt ? new Date(item.createdAt).toLocaleDateString().toUpperCase() : '')}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </section>
);

export default function GuidesClient({ guideArticles, subTags }: GuidesClientProps) {
    const featured = guideArticles[0];
    const heroGridItems = guideArticles.slice(1, 5);

    const getArticlesByCategory = (tag: string) => {
        return guideArticles.filter(a => a.categoryTag === tag).slice(0, 5);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.guidesContainer}>
                {/* Hybrid Hero Section */}
                <section className={styles.heroSection}>
                    {featured && (
                        <Link href={`/guides-and-tips/post/${featured.id}`} className={styles.heroMain}>
                            <Image src={featured.image} alt={featured.title} fill className={styles.heroImage} priority sizes="(max-width: 1024px) 100vw, 900px" />
                            <div className={styles.heroOverlay}>
                                <h1 className={styles.heroTitle}>{featured.title}</h1>
                            </div>
                        </Link>
                    )}

                    <div className={styles.heroGrid}>
                        {heroGridItems.map(item => (
                            <Link key={item.id} href={`/guides-and-tips/post/${item.id}`} className={styles.heroGridCard}>
                                <div className={styles.heroGridImageWrapper}>
                                    <Image src={item.image} alt={item.title} fill className={styles.heroGridImage} sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 300px" />
                                </div>
                                <h2 className={styles.heroGridTitle}>{item.title}</h2>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Dynamic Sections */}
                {subTags.map(tag => {
                    const articles = getArticlesByCategory(tag.name);
                    if (articles.length === 0) return null;
                    return (
                        <Section
                            key={tag.id}
                            title={tag.name}
                            categoryTag={tag.name}
                            items={articles}
                        />
                    );
                })}
            </div>
        </div>
    );
}
