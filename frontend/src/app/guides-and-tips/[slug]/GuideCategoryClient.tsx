'use client';

import Link from 'next/link';
import styles from '../HowTo.module.css';

interface GuideCategoryClientProps {
    articles: any[];
    currentTagName: string;
}

export default function GuideCategoryClient({ articles, currentTagName }: GuideCategoryClientProps) {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.howToContainer} style={{ paddingTop: '40px' }}>
                <div className={styles.categoryHeader}>
                    <h2 className={styles.sectionTitle}>{currentTagName}</h2>
                </div>

                {articles.length > 0 ? (
                    <div className={styles.sectionGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {articles.map((item: any) => (
                            <Link href={`/guides-and-tips/post/${item.id}`} key={item.id} className={styles.articleCard}>
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
