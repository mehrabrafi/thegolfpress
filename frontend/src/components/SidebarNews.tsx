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

    const getHref = (article: Article) => {
        const category = (article.category || article.categoryTag || '').toUpperCase();
        if (category === 'COURSES') return `/courses/${article.id}`;
        if (category === 'EQUIPMENT') return `/equipment/${article.id}`;
        if (category === 'LIFESTYLE') return `/lifestyle/${article.id}`;
        if (category === 'GUIDES-TIPS') return `/guides-and-tips/post/${article.id}`;
        return `/news/${article.id}`;
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h2>TRENDING NOW</h2>
            </div>
            <div className={styles.list}>
                {articles.map((article, idx) => {
                    const href = getHref(article);

                    return (
                        <Link key={idx} href={href} className={styles.item}>
                            {article.image && (
                                <div className={styles.imageWrapper}>
                                    <Image src={article.image} alt={article.title} fill sizes="100px" style={{ objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className={styles.content}>
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
