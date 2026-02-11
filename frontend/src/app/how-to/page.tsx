'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HowTo.module.css';
import { fetchNews } from '@/lib/api';

const CATEGORIES = [
    'Swing Sequence',
    'Putting',
    'Short Game',
    'Driving',
    'Beginners',
    'Mental Game',
    'Fitness'
];

const Section = ({ title, items, categoryTag }: { title: string, items: any[], categoryTag: string }) => (
    <section className={styles.categorySection}>
        <div className={styles.sectionHeaderRow}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <Link href={`/how-to/${categoryTag.toLowerCase().replace(' ', '-')}`} className={styles.viewAllLink}>
                View All
            </Link>
        </div>
        <div className={styles.sectionGrid}>
            {items.map(item => (
                <Link href={`/news/${item.id}`} key={item.id} className={styles.articleCard}>
                    <img src={item.image} alt={item.title} className={styles.articleImage} />
                    <span className={styles.articleTag}>{item.categoryTag}</span>
                    <h4 className={styles.articleTitle}>{item.title}</h4>
                    <div className={styles.articleAuthor}>BY {item.author?.name || 'GolfWire Staff'}</div>
                </Link>
            ))}
        </div>
    </section>
);

export default function HowToPage() {
    const [howToArticles, setHowToArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchNews('HOW-TO');
                setHowToArticles(data);
            } catch (error) {
                console.error('Error fetching how-to articles:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className={styles.loading}>Loading articles...</div>;

    const featured = howToArticles[0];
    const heroGridItems = howToArticles.slice(1, 5);

    const getArticlesByCategory = (tag: string) => {
        return howToArticles.filter(a => a.categoryTag === tag).slice(0, 5);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.catNavWrapper}>
                <div className={styles.catNavContent}>
                    <nav className={styles.catNav}>
                        <Link href="/how-to" className={`${styles.catLink} ${styles.catLinkActive}`}>All</Link>
                        {CATEGORIES.map(cat => (
                            <Link key={cat} href={`/how-to/${cat.toLowerCase().replace(/ /g, '-')}`} className={styles.catLink}>
                                {cat}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className={styles.howToContainer}>
                {/* Hybrid Hero Section */}
                <section className={styles.heroSection}>
                    {featured && (
                        <Link href={`/news/${featured.id}`} className={styles.heroMain}>
                            <img src={featured.image} alt={featured.title} className={styles.heroImage} />
                            <div className={styles.heroOverlay}>
                                <span className={styles.heroTag}>{featured.categoryTag}</span>
                                <h2 className={styles.heroTitle}>{featured.title}</h2>
                                <div className={styles.heroAuthor}>
                                    {featured.author?.image && <img src={featured.author.image} alt={featured.author.name} className={styles.heroThumb} />}
                                    BY {featured.author?.name || 'GolfWire Staff'}
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className={styles.heroGrid}>
                        {heroGridItems.map(item => (
                            <Link key={item.id} href={`/news/${item.id}`} className={styles.heroGridCard}>
                                <img src={item.image} alt={item.title} className={styles.heroGridImage} />
                                <span className={styles.heroGridTag}>{item.categoryTag}</span>
                                <h3 className={styles.heroGridTitle}>{item.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* New Sections */}
                <Section title="Swing Sequence" categoryTag="Swing Sequence" items={getArticlesByCategory('Swing Sequence')} />
                <Section title="Putting" categoryTag="Putting" items={getArticlesByCategory('Putting')} />
                <Section title="Short Game" categoryTag="Short Game" items={getArticlesByCategory('Short Game')} />
                <Section title="Driving" categoryTag="Driving" items={getArticlesByCategory('Driving')} />
                <Section title="Beginners" categoryTag="Beginners" items={getArticlesByCategory('Beginners')} />
                <Section title="Fitness" categoryTag="Fitness" items={getArticlesByCategory('Fitness')} />
                <Section title="Mental Game" categoryTag="Mental Game" items={getArticlesByCategory('Mental Game')} />
            </div>
        </div>
    );
}
