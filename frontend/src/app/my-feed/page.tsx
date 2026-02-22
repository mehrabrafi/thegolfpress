'use client';

import { useState, useEffect } from 'react';
import { fetchMyFeed } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './MyFeed.module.css';

interface Article {
    id: string;
    title: string;
    image: string;
    category?: string;
    excerpt?: string;
    content?: string;
}

export default function MyFeedPage() {
    const { user, loading: authLoading, openOnboarding } = useAuth();
    const router = useRouter();
    const [sections, setSections] = useState<{ [key: string]: Article[] }>({});
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (!authLoading && user) {
            const loadFeed = async () => {
                try {
                    const data = await fetchMyFeed();

                    // Group articles by category
                    const grouped = data.reduce((acc: { [key: string]: Article[] }, item: Article) => {
                        const cat = item.category || 'News';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(item);
                        return acc;
                    }, {});

                    setSections(grouped);
                } catch (err) {
                    console.error('Failed to load My Feed:', err);
                } finally {
                    setLoading(false);
                }
            };
            loadFeed();
        }
    }, [user, authLoading, router]);

    if (authLoading || (!user && !authLoading)) {
        return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading...</div>;
    }

    const categories = ['All', ...Object.keys(sections)];

    const filteredArticles: Article[] = selectedCategory === 'All'
        ? Object.values(sections).flat()
        : sections[selectedCategory] || [];

    const hasPreferences = user?.followedPlayers?.length > 0 || JSON.parse(user?.preferredCategories || '[]').length > 0;

    return (
        <div className="container">
            <div className={styles.feedContainer}>
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.title}>LATEST FOR YOU</h1>
                        <button className={styles.tuneBtn} onClick={() => openOnboarding('tune')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Tune My Feed
                        </button>
                    </div>
                    {!hasPreferences && (
                        <div className={styles.noPreferencesInfo}>
                            Showing latest news. <span onClick={() => openOnboarding('tune')} className={styles.inlineLink}>Personalize your feed</span> to see news matching your interests.
                        </div>
                    )}
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>Loading Feed...</div>
                ) : (
                    <>
                        <div className={styles.chipsContainer}>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`${styles.chip} ${selectedCategory === cat ? styles.activeChip : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {filteredArticles.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px', background: '#f9f9f9', borderRadius: '12px' }}>
                                <h3>No news found in this category.</h3>
                                <p>Try following more players or selecting different interests.</p>
                            </div>
                        ) : (
                            <div className={styles.gridContainer}>
                                {filteredArticles.map((article) => (
                                    <Link
                                        href={`/news/${article.id}`}
                                        key={article.id}
                                        className={styles.articleCard}
                                    >
                                        <div className={styles.imageWrapper}>
                                            <Image
                                                src={article.image || '/images/placeholder.jpg'}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className={styles.articleImage}
                                            />
                                            <span className={styles.categoryBadge}>{article.category || 'NEWS'}</span>
                                        </div>
                                        <div className={styles.articleContent}>
                                            <h3 className={styles.articleTitle}>{article.title}</h3>
                                            <p className={styles.excerpt}>
                                                {article.excerpt || article.content?.substring(0, 120) + '...'}
                                            </p>
                                            <div className={styles.cardFooter}>
                                                <span>Read More</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );

}
