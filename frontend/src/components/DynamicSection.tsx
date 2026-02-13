import Link from 'next/link';
import styles from './DynamicSection.module.css';

interface DynamicSectionProps {
    title: string;
    articles: any[];
    link?: string;
    linkText?: string;
}

export default function DynamicSection({ title, articles, link, linkText }: DynamicSectionProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                {link && linkText && (
                    <Link href={link} className={styles.link}>{linkText}</Link>
                )}
            </div>
            <div className={styles.grid}>
                {articles.map((item, idx) => {
                    const isCourse = (item.category && item.category.toUpperCase() === 'COURSES') ||
                        (item.categoryTag && item.categoryTag.toUpperCase() === 'COURSES');
                    const catUpper = (item.category || '').toUpperCase();
                    const isGuide = catUpper === 'GUIDES-TIPS';
                    const linkHref = isCourse ? `/courses/${item.id}` : isGuide ? `/guides-and-tips/post/${item.id}` : `/news/${item.id}`;

                    return (
                        <Link key={idx} href={linkHref} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img src={item.image} alt={item.title} className={styles.image} />
                                {item.categoryTag && <span className={styles.tag}>{item.categoryTag}</span>}
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}
