import Link from 'next/link';
import Image from 'next/image';
import styles from './LatestNews.module.css';

interface LatestNewsProps {
    articles: any[];
    title?: string;
    seeAllText?: string;
    seeAllHref?: string;
}

export default function LatestNews({
    articles,
    title = 'NEWS',
    seeAllText = 'SEE ALL NEWS',
    seeAllHref = '/news'
}: LatestNewsProps) {
    if (!articles || articles.length === 0) return null;

    // We need 10 articles total for this layout
    const featuredArticles = articles.slice(0, 4);
    const listArticles = articles.slice(4, 10);

    return (
        <section className={styles.latestNews}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>{title}</h2>
                <Link href={seeAllHref} className={styles.seeAllBtn}>
                    {seeAllText}
                </Link>
            </div>

            <div className={styles.contentGrid}>
                {/* Left side: Two Featured Cards */}
                <div className={styles.featuredColumn}>
                    {featuredArticles.map((article) => {
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
                            <div key={article.id} className={styles.featuredCard}>
                                <Link href={linkHref} className={styles.imageLink}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={article.image || '/images/placeholder.jpg'}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 400px"
                                            className={styles.articleImage}
                                        />
                                    </div>
                                </Link>
                                <div className={styles.cardInfo}>
                                    <span className={styles.categoryBadge}>
                                        {article.category || 'NEWS'}
                                    </span>
                                    <Link href={linkHref}>
                                        <h3 className={styles.featuredTitle}>{article.title}</h3>
                                    </Link>
                                    <div className={styles.authorLine}>
                                        BY {article.author?.toUpperCase() || 'THE GOLF PRESS'}
                                    </div>
                                    <p className={styles.excerpt}>
                                        {article.excerpt || article.content?.substring(0, 120) + '...'}
                                    </p>
                                    <Link href={linkHref} className={styles.readArticle}>
                                        Read Article
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right side: List of Articles */}
                <div className={styles.listColumn}>
                    {listArticles.map((article) => {
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
                            <div key={article.id} className={styles.listItem}>
                                <Link href={linkHref} className={styles.listImageLink}>
                                    <div className={styles.listImageWrapper}>
                                        <Image
                                            src={article.image || '/images/placeholder.jpg'}
                                            alt={article.title}
                                            fill
                                            sizes="120px"
                                            className={styles.articleImage}
                                        />
                                    </div>
                                </Link>
                                <div className={styles.listInfo}>
                                    <span className={styles.categoryBadge}>
                                        {article.category || 'NEWS'}
                                    </span>
                                    <Link href={linkHref}>
                                        <h4 className={styles.listTitle}>{article.title}</h4>
                                    </Link>
                                    <div className={styles.listFooter}>
                                        <Link href={linkHref} className={styles.readArticle}>
                                            Read Article
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
