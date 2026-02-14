import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './not-found.module.css';

export const metadata: Metadata = {
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found. Browse The Golf Press for live scores, news, and course reviews.',
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <span className={styles.errorCode}>404</span>
                <h1 className={styles.title}>Page Not Found</h1>
                <p className={styles.description}>
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on the fairway.
                </p>
                <div className={styles.links}>
                    <Link href="/" className={styles.primaryLink}>
                        Back to Home
                    </Link>
                    <Link href="/news" className={styles.secondaryLink}>
                        Latest News
                    </Link>
                    <Link href="/scores" className={styles.secondaryLink}>
                        Live Scores
                    </Link>
                </div>
            </div>
        </div>
    );
}
