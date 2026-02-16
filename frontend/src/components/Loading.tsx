'use client';

import Image from 'next/image';
import styles from './Loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.logoWrapper}>
                <Image src="/logo.png" alt="Loading..." width={200} height={60} className={styles.loadingLogo} priority />
                <div className={styles.shimmer}></div>
            </div>
            <p className={styles.loadingText}>PREPARING YOUR EXPERIENCE</p>
        </div>
    );
}
