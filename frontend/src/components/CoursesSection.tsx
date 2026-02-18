import Link from 'next/link';
import Image from 'next/image';
import styles from './CoursesSection.module.css';

interface Course {
    id: string;
    title: string;
    image: string;
    categoryTag?: string;
}

export default function CoursesSection({ courses }: { courses: Course[] }) {
    if (!courses || courses.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Featured Courses</h2>
                <Link href="/courses" className={styles.link}>VIEW ALL COURSES →</Link>
            </div>
            <div className={styles.grid}>
                {courses.slice(0, 3).map((item, idx) => (
                    <Link key={idx} href={`/courses/${item.id}`} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image src={item.image} alt={item.title} fill className={styles.image} sizes="(max-width: 768px) 100vw, 33vw" />
                        </div>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}
