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

    // 1 large article + 4 small articles
    const mainArticles = articles.slice(0, 1);
    const listArticles = articles.slice(1, 5);

    const getLinkHref = (article: any) => {
        const category = (article.category || article.categoryTag || '').toUpperCase();
        if (category === 'COURSES') return `/courses/${article.id}`;
        if (category === 'GUIDES-TIPS') return `/guides-and-tips/post/${article.id}`;
        if (category === 'EQUIPMENT') return `/equipment/${article.id}`;
        if (category === 'LIFESTYLE') return `/lifestyle/${article.id}`;
        return `/news/${article.id}`;
    };

    return (
        <section className={styles.latestNews}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.headerRight}>
                    <Link href={seeAllHref} className={styles.seeAllBtn}>
                        All <span className={styles.dropdownIcon}>▼</span>
                    </Link>
                </div>
            </div>

            <div className={styles.contentGrid}>
                {/* Left Column: Main Articles */}
                <div className={styles.mainColumn}>
                    {mainArticles.map((mainArticle, index) => (
                        <div key={mainArticle.id || index} className={styles.mainArticleCard}>
                            <Link href={getLinkHref(mainArticle)} className={styles.imageLink}>
                                <div className={styles.mainImageWrapper}>
                                    <Image
                                        src={mainArticle.image || '/images/placeholder.jpg'}
                                        alt={mainArticle.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 600px"
                                        className={styles.articleImage}
                                    />
                                    <span className={styles.imageBadge}>
                                        {mainArticle.category || 'NEWS'}
                                    </span>
                                </div>
                            </Link>
                            <Link href={getLinkHref(mainArticle)}>
                                <h3 className={styles.mainTitle}>{mainArticle.title}</h3>
                            </Link>
                            <div className={styles.authorLine}>
                                <span className={styles.authorName}>{mainArticle.author || 'The Golf Press'}</span>
                                <span className={styles.separator}>-</span>
                                <span>{new Date(mainArticle.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <p className={styles.excerpt}>
                                {mainArticle.excerpt || mainArticle.content?.substring(0, 120) + '...'}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Middle Column: List of 8 Articles */}
                <div className={styles.listColumn}>
                    {listArticles.map((article) => {
                        return (
                            <div key={article.id} className={styles.listItem}>
                                <Link href={getLinkHref(article)} className={styles.listImageLink}>
                                    <div className={styles.listImageWrapper}>
                                        <Image
                                            src={article.image || '/images/placeholder.jpg'}
                                            alt={article.title}
                                            fill
                                            sizes="120px"
                                            className={styles.articleImage}
                                        />
                                        <span className={styles.smallBadge}>
                                            {article.category || 'NEWS'}
                                        </span>
                                    </div>
                                </Link>
                                <div className={styles.listInfo}>
                                    <Link href={getLinkHref(article)}>
                                        <h4 className={styles.listTitle}>{article.title}</h4>
                                    </Link>
                                    <div className={styles.listDate}>
                                        {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
