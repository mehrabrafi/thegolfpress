import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

interface HeroProps {
    article: any;
}

export default function Hero({ article }: HeroProps) {
    if (!article) return null;

    return (
        <section className={styles.hero}>
            <div className={styles.bgWrapper}>
                <Image src={article.image} alt={article.title} fill priority className={styles.heroImage} />
            </div>
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <span className={styles.tag}><span className={styles.icon}>⛳</span> {article.categoryTag || article.category}</span>
                    <h1>{article.title}</h1>
                    <p>{article.excerpt || article.content?.substring(0, 150) + '...'}</p>
                    {(() => {
                        const isCourse = (article.category && article.category.toUpperCase() === 'COURSES') ||
                            (article.categoryTag && article.categoryTag?.toUpperCase() === 'COURSES');
                        const href = isCourse ? `/courses/${article.id}` : `/news/${article.id}`;

                        return (
                            <Link href={href}>
                                <button className={styles.readBtn}>Read Story <span className={styles.arrow}>→</span></button>
                            </Link>
                        );
                    })()}
                </div>
            </div>
        </section>
    );
}
