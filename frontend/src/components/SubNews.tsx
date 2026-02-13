import Link from 'next/link';
import styles from './SubNews.module.css';

interface SubNewsProps {
    articles: any[];
}

export default function SubNews({ articles }: SubNewsProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className={styles.grid}>
            {articles.map((item, idx) => {
                const isCourse = (item.category && item.category.toUpperCase() === 'COURSES') ||
                    (item.categoryTag && item.categoryTag?.toUpperCase() === 'COURSES');
                const href = isCourse ? `/courses/${item.id}` : `/news/${item.id}`;

                return (
                    <Link key={idx} href={href} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.title} />
                            <span className={styles.tag}>{item.categoryTag || item.category}</span>
                        </div>
                        <div className={styles.body}>
                            <h3>{item.title}</h3>
                            <div className={styles.time}>{item.time || new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}
