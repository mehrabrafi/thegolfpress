import Link from 'next/link';
import Image from 'next/image';
import styles from './DualColumnNews.module.css';

interface DualColumnNewsProps {
    articles: any[];
    title: string;
    seeAllText: string;
    seeAllHref: string;
}

export default function DualColumnNews({
    articles,
    title,
    seeAllText,
    seeAllHref
}: DualColumnNewsProps) {
    if (!articles || articles.length === 0) return null;

    const column1Articles = articles.slice(0, 6);
    const column2Articles = articles.slice(6, 12);

    const getLinkHref = (article: any) => {
        const category = (article.category || article.categoryTag || '').toUpperCase();
        if (category === 'COURSES') return `/courses/${article.id}`;
        if (category === 'GUIDES-TIPS') return `/guides-and-tips/post/${article.id}`;
        if (category === 'EQUIPMENT') return `/equipment/${article.id}`;
        if (category === 'LIFESTYLE') return `/lifestyle/${article.id}`;
        return `/news/${article.id}`;
    };

    const renderColumn = (colArticles: any[]) => {
        if (colArticles.length === 0) return null;
        const mainArticle = colArticles[0];
        const listArticles = colArticles.slice(1);

        return (
            <div className={styles.column}>
                <div className={styles.mainArticleCard}>
                    <Link href={getLinkHref(mainArticle)} className={styles.imageLink}>
                        <div className={styles.mainImageWrapper}>
                            <Image
                                src={mainArticle.image || '/images/placeholder.jpg'}
                                alt={mainArticle.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
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
                    <div className={styles.metaRow}>
                        <div className={styles.authorLine}>
                            <span className={styles.authorName}>{mainArticle.author || 'The Golf Press'}</span>
                            <span className={styles.separator}>-</span>
                            <span>{new Date(mainArticle.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <p className={styles.excerpt}>
                        {mainArticle.excerpt || mainArticle.content?.substring(0, 120) + '...'}
                    </p>
                </div>

                <div className={styles.listContainer}>
                    {listArticles.map((article) => (
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
                                </div>
                            </Link>
                            <div className={styles.listInfo}>
                                <Link href={getLinkHref(article)}>
                                    <h4 className={styles.listTitle}>{article.title}</h4>
                                </Link>
                                <div className={styles.listDateRow}>
                                    <span className={styles.smallBadge}>
                                        {article.category || 'NEWS'}
                                    </span>
                                    <span className={styles.listDate}>
                                        {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className={styles.dualColumnNews}>
            <div className={styles.gridContainer}>

                {/* Main Content Area */}
                <div className={styles.mainContentArea}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.title}>{title}</h2>
                        <div className={styles.headerRight}>
                            <Link href={seeAllHref} className={styles.seeAllBtn}>
                                All <span className={styles.dropdownIcon}>▼</span>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.newsColumnsGrid}>
                        {renderColumn(column1Articles)}
                        {renderColumn(column2Articles)}
                    </div>
                </div>
            </div>
        </section>
    );
}
