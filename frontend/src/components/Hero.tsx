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
                    <h2>{article.title}</h2>
                    <p>{article.excerpt || article.content?.substring(0, 150) + '...'}</p>
                    {(() => {
                        const category = (article.category || article.categoryTag || '').toUpperCase();
                        const isCourse = category === 'COURSES';
                        const isEquipment = category === 'EQUIPMENT';
                        const isLifestyle = category === 'LIFESTYLE';
                        const isGuide = category === 'GUIDES-TIPS';

                        let href = `/news/${article.id}`;
                        if (isCourse) href = `/courses/${article.id}`;
                        else if (isEquipment) href = `/equipment/${article.id}`;
                        else if (isLifestyle) href = `/lifestyle/${article.id}`;
                        else if (isGuide) href = `/guides-and-tips/post/${article.id}`;

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
