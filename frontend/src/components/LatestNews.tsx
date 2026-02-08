import Link from 'next/link';
import styles from './LatestNews.module.css';

interface NewsItem {
    title: string;
    image: string;
    tag: string;
    excerpt: string;
    time: string;
}

export default function LatestNews({ articles }: { articles: any[] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className={styles.latestNews}>
            <div className={styles.sectionHeader}>
                <h2>Latest News</h2>
                <Link href="/news" className={styles.viewAll}>View All News →</Link>
            </div>
            <div className={styles.grid}>
                {articles.map((item, idx) => (
                    <Link key={idx} href={`/news/${item.id}`} className={styles.newsCard}>
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.title} />
                            <span className={styles.tag}>{item.categoryTag || item.category}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <h3>{item.title}</h3>
                            <p>{item.excerpt || item.content?.substring(0, 100) + '...'}</p>
                            <div className={styles.time}>{item.time || new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
