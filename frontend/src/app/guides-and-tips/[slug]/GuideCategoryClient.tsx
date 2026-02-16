'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '../Guides.module.css';

interface GuideCategoryClientProps {
    articles: any[];
    currentTagName: string;
}

export default function GuideCategoryClient({ articles, currentTagName }: GuideCategoryClientProps) {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.guidesContainer} style={{ paddingTop: '40px' }}>
                <div className={styles.categoryHeader}>
                    <h2 className={styles.sectionTitle}>{currentTagName}</h2>
                </div>

                {articles.length > 0 ? (
                    <div className={styles.sectionGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {articles.map((item: any) => (
                            <Link href={`/guides-and-tips/post/${item.id}`} key={item.id} className={styles.articleCard}>
                                <div className={styles.articleImageWrapper}>
                                    <Image src={item.image} alt={item.title} fill className={styles.articleImage} sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 300px" />
                                </div>
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
