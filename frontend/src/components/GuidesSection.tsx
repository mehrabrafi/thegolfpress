import Link from 'next/link';
import Image from 'next/image';
import styles from './GuidesSection.module.css';

export default function GuidesSection({ articles }: { articles: any[] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Improve Your Game</h2>
                <Link href="/guides-and-tips" className={styles.link}>VIEW ALL TIPS →</Link>
            </div>
            <div className={styles.grid}>
                {articles.slice(0, 3).map((item, idx) => (
                    <Link key={idx} href={`/guides-and-tips/post/${item.id}`} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image src={item.image} alt={item.title} fill className={styles.image} sizes="(max-width: 768px) 100vw, 33vw" />
                        </div>
                        <div className={styles.content}>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.excerpt}>{item.excerpt}</p>
                            <div className={styles.meta}>
                                BY {item.author?.toUpperCase() || 'THE GOLF PRESS'} • PUBLISHED {item.time?.toUpperCase() || (item.createdAt ? new Date(item.createdAt).toLocaleDateString().toUpperCase() : '')}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section >
    );
}
