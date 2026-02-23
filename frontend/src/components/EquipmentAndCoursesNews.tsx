'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './EquipmentAndCoursesNews.module.css';
import { fetchNews } from '@/lib/api';

interface EquipmentAndCoursesNewsProps {
    equipmentArticles: any[];
    coursesArticles: any[];
}

export default function EquipmentAndCoursesNews({
    equipmentArticles,
    coursesArticles,
}: EquipmentAndCoursesNewsProps) {
    const ITEMS_PER_PAGE = 10;

    // All articles we have (initially from server, grows with API fetches)
    const [allArticles] = useState<any[]>(equipmentArticles || []);
    // How many to show
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    // Extra articles loaded from API beyond the initial batch
    const [extraArticles, setExtraArticles] = useState<any[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [noMoreFromApi, setNoMoreFromApi] = useState(false);

    if ((!equipmentArticles || equipmentArticles.length === 0) && (!coursesArticles || coursesArticles.length === 0)) return null;

    const combinedArticles = [...allArticles, ...extraArticles];
    const displayedArticles = combinedArticles.slice(0, visibleCount);
    const hasMore = !noMoreFromApi || visibleCount < combinedArticles.length;

    const mainCourseArticles = coursesArticles.slice(0, 4);

    const getLinkHref = (article: any) => {
        if (!article) return '#';
        const category = (article.category || article.categoryTag || '').toUpperCase();
        if (category === 'COURSES') return `/courses/${article.id}`;
        if (category === 'GUIDES-TIPS') return `/guides-and-tips/post/${article.id}`;
        if (category === 'EQUIPMENT') return `/equipment/${article.id}`;
        if (category === 'LIFESTYLE') return `/lifestyle/${article.id}`;
        return `/news/${article.id}`;
    };

    const handleLoadMore = async () => {
        if (loadingMore) return;

        const nextVisibleCount = visibleCount + ITEMS_PER_PAGE;

        // If we already have enough articles loaded, just show more
        if (nextVisibleCount <= combinedArticles.length) {
            setVisibleCount(nextVisibleCount);
            return;
        }

        // Otherwise, fetch more from API
        if (noMoreFromApi) {
            // Show remaining articles if any
            setVisibleCount(combinedArticles.length);
            return;
        }

        setLoadingMore(true);
        try {
            const apiOffset = allArticles.length + extraArticles.length;
            const { data } = await fetchNews('EQUIPMENT', undefined, undefined, apiOffset, ITEMS_PER_PAGE);
            if (data && data.length > 0) {
                setExtraArticles(prev => [...prev, ...data]);
                setVisibleCount(nextVisibleCount);
                if (data.length < ITEMS_PER_PAGE) {
                    setNoMoreFromApi(true);
                }
            } else {
                setNoMoreFromApi(true);
                // Show everything we have
                setVisibleCount(allArticles.length + extraArticles.length);
            }
        } catch (error) {
            console.error('Error loading more equipment articles:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <section className={styles.equipmentCoursesSection}>
            <div className={styles.gridContainer}>

                {/* Left Column (Equipment) */}
                <div className={styles.leftColumn}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.title}>EQUIPMENT</h2>
                        <div className={styles.headerRight}>
                            <Link href="/equipment" className={styles.seeAllBtn}>
                                All <span className={styles.dropdownIcon}>▼</span>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.leftArticlesList}>
                        {displayedArticles.map((article) => (
                            <div key={article.id} className={styles.leftListItem}>
                                <Link href={getLinkHref(article)} className={styles.listImageLink}>
                                    <div className={styles.leftListImageWrapper}>
                                        <Image
                                            src={article.image || '/images/placeholder.jpg'}
                                            alt={article.title}
                                            fill
                                            sizes="180px"
                                            className={styles.articleImage}
                                        />
                                    </div>
                                </Link>
                                <div className={styles.leftListInfo}>
                                    <Link href={getLinkHref(article)}>
                                        <h4 className={styles.leftListTitle}>{article.title}</h4>
                                    </Link>
                                    <div className={styles.metaRow}>
                                        <span className={styles.categoryBadge}>
                                            {article.category || 'EQUIPMENT'}
                                        </span>
                                        <span className={styles.authorName}>
                                            {article.author || 'The Golf Press'}
                                        </span>
                                        <span className={styles.separator}>-</span>
                                        <span className={styles.date}>
                                            {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className={styles.excerpt}>
                                        {article.excerpt || article.content?.substring(0, 80) + '...'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <span className={styles.loadMoreSpinner}></span>
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Articles'
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column (Courses) */}
                <div className={styles.rightColumn}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.title}>COURSES</h2>
                    </div>

                    <div className={styles.rightArticlesList}>
                        {mainCourseArticles.map((article) => (
                            <div key={article.id} className={styles.rightListItem}>
                                <Link href={getLinkHref(article)} className={styles.imageLink}>
                                    <div className={styles.rightImageWrapper}>
                                        <Image
                                            src={article.image || '/images/placeholder.jpg'}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 30vw"
                                            className={styles.articleImage}
                                        />
                                        <div className={styles.imageOverlayBadge}>
                                            {article.category || 'COURSES'}
                                        </div>
                                    </div>
                                </Link>
                                <div className={styles.rightListInfo}>
                                    <Link href={getLinkHref(article)}>
                                        <h4 className={styles.rightListTitle}>{article.title}</h4>
                                    </Link>
                                    <div className={styles.bottomMeta}>
                                        <div className={styles.metaRow}>
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
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
