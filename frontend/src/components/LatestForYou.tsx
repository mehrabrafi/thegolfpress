'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './LatestForYou.module.css';

interface Article {
    id: string;
    title: string;
    image: string;
    category?: string;
    excerpt?: string;
    content?: string;
}

interface LatestForYouProps {
    articles: Article[];
    title?: string;
    showSeeAll?: boolean;
}

export default function LatestForYou({
    articles,
    title = "Latest for You",
    showSeeAll = true
}: LatestForYouProps) {
    if (!articles || articles.length === 0) return null;

    // We can show up to 7 articles in our bento grid pattern
    const bentoArticles = articles.slice(0, 7);
    const remainingArticles = articles.slice(7);

    const getCardClass = (index: number) => {
        switch (index) {
            case 0: return styles.cardLarge;
            case 1: return styles.cardMedium;
            case 2: return styles.cardSmall;
            case 3: return styles.cardSmall;
            case 4: return styles.cardTall;
            case 5: return styles.cardMedium;
            case 6: return styles.cardSmall;
            default: return styles.cardSmall;
        }
    };

    const getHref = (article: Article) => {
        const category = (article.category || '').toUpperCase();
        if (category === 'COURSES') return `/courses/${article.id}`;
        if (category === 'EQUIPMENT') return `/equipment/${article.id}`;
        if (category === 'LIFESTYLE') return `/lifestyle/${article.id}`;
        if (category === 'GUIDES-TIPS') return `/guides-and-tips/post/${article.id}`;
        return `/news/${article.id}`;
    };

    return (
        <section className={styles.latestForYou}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>{title}</h2>
                {showSeeAll && (
                    <Link href="/my-feed" className={styles.seeAllBtn}>
                        VIEW ALL FEEDS
                    </Link>
                )}
            </div>

            <div className={styles.bentoGrid}>
                {bentoArticles.map((article, index) => (
                    <Link
                        href={getHref(article)}
                        key={article.id}
                        className={`${styles.bentoCard} ${getCardClass(index)}`}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={article.image || '/images/placeholder.jpg'}
                                alt={article.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 500px"
                                className={styles.articleImage}
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <span className={`${styles.badge} ${styles.personalizedBadge}`}>
                                {index === 0 ? 'Featured' : (article.category || 'For You')}
                            </span>
                            <h3 className={styles.articleTitle}>{article.title}</h3>
                            <p className={styles.excerpt}>
                                {article.excerpt || article.content?.substring(0, 80) + '...'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {remainingArticles.length > 0 && (
                <div className={styles.remainingList}>
                    {remainingArticles.map(article => (
                        <Link
                            href={getHref(article)}
                            key={article.id}
                            className={styles.remainingItem}
                        >
                            <div className={styles.remainingImageWrapper}>
                                <Image
                                    src={article.image || '/images/placeholder.jpg'}
                                    alt={article.title}
                                    fill
                                    className={styles.articleImage}
                                />
                            </div>
                            <div className={styles.remainingContent}>
                                <span className={styles.subBadge}>{article.category || 'News'}</span>
                                <h4 className={styles.remainingTitle}>{article.title}</h4>
                                <p className={styles.remainingExcerpt}>
                                    {article.excerpt || article.content?.substring(0, 100) + '...'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
