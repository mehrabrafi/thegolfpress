'use client';

import styles from './not-found.module.css';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <span className={styles.errorCode}>500</span>
                <h1 className={styles.title}>Something Went Wrong</h1>
                <p className={styles.description}>
                    We encountered an unexpected error. Please try again, or head back
                    to the homepage.
                </p>
                <div className={styles.links}>
                    <button onClick={() => reset()} className={styles.primaryLink} style={{ border: 'none', cursor: 'pointer' }}>
                        Try Again
                    </button>
                    <a href="/" className={styles.secondaryLink}>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
