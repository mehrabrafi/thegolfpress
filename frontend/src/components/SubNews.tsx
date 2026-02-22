import Link from 'next/link';
import Image from 'next/image';
import styles from './SubNews.module.css';

interface SubNewsProps {
    articles: any[];
}

export default function SubNews({ articles }: SubNewsProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className={styles.grid}>
            {articles.map((item, idx) => {
                const category = (item.category || item.categoryTag || '').toUpperCase();
                const isCourse = category === 'COURSES';
                const isEquipment = category === 'EQUIPMENT';
                const isLifestyle = category === 'LIFESTYLE';
                const isGuide = category === 'GUIDES-TIPS';

                let href = `/news/${item.id}`;
                if (isCourse) href = `/courses/${item.id}`;
                else if (isEquipment) href = `/equipment/${item.id}`;
                else if (isLifestyle) href = `/lifestyle/${item.id}`;
                else if (isGuide) href = `/guides-and-tips/post/${item.id}`;

                return (
                    <Link key={idx} href={href} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className={styles.body}>
                            <h3>{item.title}</h3>
                            <div className={styles.time}>{item.time || new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}
