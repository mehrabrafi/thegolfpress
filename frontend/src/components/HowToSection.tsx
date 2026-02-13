import Link from 'next/link';
import styles from './HowToSection.module.css';

export default function HowToSection({ articles }: { articles: any[] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Improve Your Game</h2>
                <Link href="/guides-and-tips" className={styles.link}>VIEW ALL TIPS →</Link>
            </div>
            <div className={styles.grid}>
                {articles.slice(0, 4).map((item, idx) => (
                    <Link key={idx} href={`/news/${item.id}`} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.title} className={styles.image} />
                        </div>
                        <span className={styles.tag}>{item.categoryTag || 'INSTRUCTION'}</span>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}
