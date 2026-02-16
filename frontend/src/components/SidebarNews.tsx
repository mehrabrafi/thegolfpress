import Link from 'next/link';
import Image from 'next/image';
import styles from './SidebarNews.module.css';

interface Article {
    id: string;
    title: string;
    category: string;
    categoryTag?: string;
    createdAt: string;
    time?: string;
    image?: string;
}

interface SidebarNewsProps {
    articles: Article[];
}

export default function SidebarNews({ articles }: SidebarNewsProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h2>TRENDING</h2>
            </div>
            <div className={styles.list}>
                {articles.map((article, idx) => {
                    const isCourse = (article.category && article.category.toUpperCase() === 'COURSES') ||
                        (article.categoryTag && article.categoryTag?.toUpperCase() === 'COURSES');
                    const href = isCourse ? `/courses/${article.id}` : `/news/${article.id}`;

                    return (
                        <Link key={idx} href={href} className={styles.item}>
                            {article.image && (
                                <div className={styles.imageWrapper}>
                                    <Image src={article.image} alt={article.title} fill sizes="100px" style={{ objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className={styles.content}>
                                <span className={styles.category}>{article.categoryTag || article.category || 'NEWS'}</span>
                                <h3 className={styles.title}>{article.title}</h3>
                                <span className={styles.time}>{article.time || new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
