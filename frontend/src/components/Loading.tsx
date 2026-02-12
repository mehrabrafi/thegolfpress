'use client';

import styles from './Loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.logoWrapper}>
                <img src="/logo.png" alt="Loading..." className={styles.loadingLogo} />
                <div className={styles.shimmer}></div>
            </div>
            <p className={styles.loadingText}>PREPARING YOUR EXPERIENCE</p>
        </div>
    );
}
