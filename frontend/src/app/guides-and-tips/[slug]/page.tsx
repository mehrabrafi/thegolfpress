'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../HowTo.module.css';
import { fetchNews, fetchCategories } from '@/lib/api';

export default function HowToCategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [articles, setArticles] = useState<any[]>([]);
    const [subTags, setSubTags] = useState<any[]>([]);
    const [currentTagName, setCurrentTagName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [newsData, catData] = await Promise.all([
                    fetchNews(), // Fetch all to avoid backend case sensitivity
                    fetchCategories()
                ]);

                // 1. Filter specifically for How-To articles (case-insensitive)
                const howToArticles = newsData.filter((a: any) => {
                    const c = (a.category || '').toUpperCase();
                    return c === 'HOW-TO' || c === 'HOW TO';
                });

                const howToCat = catData.find((c: any) => c.slug === 'how-to' || c.name.toLowerCase() === 'how-to');
                if (howToCat && howToCat.subTags) {
                    setSubTags(howToCat.subTags);

                    // 2. Find the matching sub-tag based on the URL slug
                    const matchedTag = howToCat.subTags.find((t: any) =>
                        t.name.toLowerCase().replace(/ /g, '-') === slug.toLowerCase()
                    );

                    if (matchedTag) {
                        setCurrentTagName(matchedTag.name);
                        // 3. Filter articles that match this sub-tag (case-insensitive)
                        const filtered = howToArticles.filter((a: any) =>
                            (a.categoryTag || '').toUpperCase() === matchedTag.name.toUpperCase()
                        );
                        setArticles(filtered);
                    } else {
                        setCurrentTagName('All How-To');
                        setArticles(howToArticles);
                    }
                }
            } catch (error) {
                console.error('Error fetching how-to category data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [slug]);

    if (loading) return <div className={styles.loading}>Loading {currentTagName || 'Category'}...</div>;

    return (
        <div className={styles.pageWrapper}>

            <div className={styles.howToContainer} style={{ paddingTop: '40px' }}>
                <div className={styles.categoryHeader}>
                    <h2 className={styles.sectionTitle}>{currentTagName}</h2>

                </div>

                {articles.length > 0 ? (
                    <div className={styles.sectionGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {articles.map((item: any) => (
                            <Link href={`/news/${item.id}`} key={item.id} className={styles.articleCard}>
                                <img src={item.image} alt={item.title} className={styles.articleImage} />
                                <span className={styles.articleTag}>{item.categoryTag}</span>
                                <h4 className={styles.articleTitle}>{item.title}</h4>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noArticles}>
                        No articles found for this section yet.
                    </div>
                )}
            </div>
        </div>
    );
}
