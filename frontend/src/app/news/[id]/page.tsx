'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchNewsById, fetchNews } from '@/lib/api';
import LatestNews from '@/components/LatestNews';
import styles from './NewsDetail.module.css';

export default function NewsDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [relatedNews, setRelatedNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function loadContent() {
            try {
                const [data, allNews] = await Promise.all([
                    fetchNewsById(id as string),
                    fetchNews()
                ]);
                setArticle(data);
                // Filter out current article from related
                setRelatedNews(allNews.filter((n: any) => n.id !== id).slice(0, 3));
            } catch (err) {
                console.error('Error loading article:', err);
            } finally {
                setLoading(false);
            }
        }

        loadContent();
    }, [id]);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Article...</div>;
    if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Article not found.</div>;

    return (
        <div className={styles.articlePage}>
            <div className="container">
                <article className={styles.articleContainer}>
                    <div className={styles.hero}>
                        <img src={article.image} alt={article.title} />
                        <span className={styles.category}>{article.categoryTag || article.category}</span>
                    </div>

                    <div className={styles.content}>
                        <h1 className={styles.title}>{article.title}</h1>

                        <div className={styles.meta}>
                            <div className={styles.author}>
                                <img src={article.author.image} alt={article.author.name} className={styles.authorImg} />
                                <span className={styles.authorName}>By {article.author.name}</span>
                            </div>
                            <div className={styles.date}>
                                {article.time} • {new Date(article.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className={styles.articleBody}>
                            {article.content.split('\n').map((para: string, idx: number) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    </div>
                </article>

                <div className={styles.relatedSection}>
                    <LatestNews articles={relatedNews} />
                </div>
            </div>
        </div>
    );
}
