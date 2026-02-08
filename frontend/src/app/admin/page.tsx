'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function AdminPage() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className={styles.welcome}>Welcome back, {user?.name}!</h1>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Users</h3>
                    <p className={styles.statValue}>1,245</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Active Users</h3>
                    <p className={styles.statValue}>843</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Posts</h3>
                    <p className={styles.statValue}>152</p>
                </div>
            </div>
        </div>
    );
}
