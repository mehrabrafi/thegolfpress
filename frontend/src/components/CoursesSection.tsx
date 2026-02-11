import Link from 'next/link';
import styles from './CoursesSection.module.css';

export default function CoursesSection({ courses }: { courses: any[] }) {
    if (!courses || courses.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Featured Courses</h2>
                <Link href="/courses" className={styles.link}>VIEW ALL COURSES →</Link>
            </div>
            <div className={styles.grid}>
                {courses.slice(0, 3).map((item, idx) => (
                    <Link key={idx} href={`/news/${item.id}`} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.title} className={styles.image} />
                            <span className={styles.tag}>{item.categoryTag}</span>
                        </div>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}
