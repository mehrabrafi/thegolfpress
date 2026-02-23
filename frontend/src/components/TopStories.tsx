import Link from 'next/link';
import Image from 'next/image';
import styles from './TopStories.module.css';

interface TopStoriesProps {
    articles: any[];
}

export default function TopStories({ articles }: TopStoriesProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className={styles.topStories}>
            {articles.map((article, idx) => {
                if (!article) return null;

                const category = (article.category || article.categoryTag || '').toUpperCase();
                const isCourse = category === 'COURSES';
                const isGuide = category === 'GUIDES-TIPS';
                const isEquipment = category === 'EQUIPMENT';
                const isLifestyle = category === 'LIFESTYLE';

                let linkHref = `/news/${article.id}`;
                if (isCourse) linkHref = `/courses/${article.id}`;
                else if (isGuide) linkHref = `/guides-and-tips/post/${article.id}`;
                else if (isEquipment) linkHref = `/equipment/${article.id}`;
                else if (isLifestyle) linkHref = `/lifestyle/${article.id}`;

                return (
                    <Link key={idx} href={linkHref} className={`${styles.storyCard} ${styles[`card${idx}`]}`}>
                        <div className={styles.imageOverlay}></div>
                        <Image
                            src={article.image || '/images/placeholder.jpg'}
                            alt={article.title}
                            fill
                            className={styles.bgImage}
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className={styles.content}>
                            <span className={styles.categoryBadge}>
                                {article.category || 'NEWS'}
                            </span>
                            <h2 className={styles.title}>{article.title}</h2>
                            <div className={styles.meta}>
                                <span>{article.author || 'The Golf Press'}</span>
                                <span className={styles.separator}>—</span>
                                <span>{new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </section>
    );
}
