import Link from 'next/link';
import styles from './SubNews.module.css';

interface SubNewsProps {
    articles: any[];
}

export default function SubNews({ articles }: SubNewsProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className={styles.grid}>
            {articles.map((item, idx) => (
                <Link key={idx} href={`/news/${item.id}`} className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src={item.image} alt={item.title} />
                        <span className={styles.tag}>{item.categoryTag || item.category}</span>
                    </div>
                    <div className={styles.body}>
                        <h3>{item.title}</h3>
                        <div className={styles.time}>{item.time || new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
