'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HowTo.module.css';
import { fetchNews, fetchCategories } from '@/lib/api';


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

                </Link>
            ))}
        </div>
    </section>
);

export default function HowToPage() {

    const [howToArticles, setHowToArticles] = useState<any[]>([]);
    const [subTags, setSubTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [newsData, catData] = await Promise.all([
                    fetchNews(),
                    fetchCategories()
                ]);

                // Filter for any variation of "How-To"
                const howToData = newsData.filter((item: any) => {
                    const cat = (item.category || '').toUpperCase();
                    return cat === 'HOW-TO' || cat === 'HOW TO';
                });

                setHowToArticles(howToData);

                const howToCat = catData.find((c: any) => c.slug === 'how-to' || c.name.toLowerCase() === 'how-to');
                if (howToCat && howToCat.subTags) {
                    setSubTags(howToCat.subTags);
                }
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

            <div className={styles.howToContainer}>
                {/* Hybrid Hero Section */}
                <section className={styles.heroSection}>
                    {featured && (
                        <Link href={`/news/${featured.id}`} className={styles.heroMain}>
                            <img src={featured.image} alt={featured.title} className={styles.heroImage} />
                            <div className={styles.heroOverlay}>
                                <span className={styles.heroTag}>{featured.categoryTag}</span>
                                <h2 className={styles.heroTitle}>{featured.title}</h2>

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
