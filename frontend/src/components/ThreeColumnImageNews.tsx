'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ThreeColumnImageNews.module.css';

interface ThreeColumnImageNewsProps {
    articles: any[];
    title: string;
}

export default function ThreeColumnImageNews({
    articles,
    title,
}: ThreeColumnImageNewsProps) {
    const [page, setPage] = useState(0);
    const perPage = 3;

    if (!articles || articles.length === 0) return null;

    const totalPages = Math.ceil(articles.length / perPage);
    const displayArticles = articles.slice(page * perPage, page * perPage + perPage);

    const getLinkHref = (article: any) => {
        const category = (article.category || article.categoryTag || '').toUpperCase();
        if (category === 'COURSES') return `/courses/${article.id}`;
        if (category === 'GUIDES-TIPS') return `/guides-and-tips/post/${article.id}`;
        if (category === 'EQUIPMENT') return `/equipment/${article.id}`;
        if (category === 'LIFESTYLE') return `/lifestyle/${article.id}`;
        return `/news/${article.id}`;
    };

    const handlePrev = () => {
        setPage((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setPage((prev) => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <section className={styles.threeColumnSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>{title}</h2>
            </div>

            <div className={styles.gridWrapper}>
                {/* Left Arrow */}
                <button
                    className={`${styles.arrowBtn} ${styles.arrowLeft} ${page === 0 ? styles.arrowDisabled : ''}`}
                    onClick={handlePrev}
                    disabled={page === 0}
                    aria-label="Previous articles"
                >
                    ←
                </button>

                {/* Right Arrow */}
                <button
                    className={`${styles.arrowBtn} ${styles.arrowRight} ${page >= totalPages - 1 ? styles.arrowDisabled : ''}`}
                    onClick={handleNext}
                    disabled={page >= totalPages - 1}
                    aria-label="Next articles"
                >
                    →
                </button>

                <div className={styles.gridContainer}>
                    {displayArticles.map((article) => (
                        <div key={article.id} className={styles.card}>
                            <Link href={getLinkHref(article)} className={styles.imageLink}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={article.image || '/images/placeholder.jpg'}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className={styles.articleImage}
                                    />
                                    <div className={styles.overlay}>
                                        <h3 className={styles.cardTitle}>{article.title}</h3>
                                        <div className={styles.metaRow}>
                                            <span className={styles.categoryBadge}>
                                                {article.category || 'NEWS'}
                                            </span>
                                            <span className={styles.authorName}>
                                                {article.author || 'The Golf Press'}
                                            </span>
                                            <span className={styles.separator}>-</span>
                                            <span className={styles.date}>
                                                {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
