'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchAdminStats } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';
import { Users, FileText, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';

export default function AdminPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchAdminStats();
                setStats(data);
            } catch (error) {
                console.error('Error loading stats', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header}>
                <h1 className={styles.welcome}>Administration Overview</h1>
                <p className={styles.subtext}>Greetings, {user?.name}. Here's the pulse of your platform today.</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.users}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Audience</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.totalUsers || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.posts}`}>
                        <FileText size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Editorial Pieces</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.totalPosts || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.published}`}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Live Content</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.publishedPosts || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.drafts}`}>
                        <Clock size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Work in Progress</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.draftPosts || 0}</p>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>Content Hub Priorities</h2>
                <div className={styles.actionGrid}>
                    <Link href="/admin/news" className={styles.actionCard}>
                        <h3>News Matrix</h3>
                        <p>Coordinate general news and breaking updates.</p>
                        <ArrowUpRight size={18} />
                    </Link>
                    <Link href="/admin/guides-and-tips" className={styles.actionCard}>
                        <h3>Guides & Tips</h3>
                        <p>Refine tutorials and pedagogical content.</p>
                        <ArrowUpRight size={18} />
                    </Link>
                    <Link href="/admin/courses" className={styles.actionCard}>
                        <h3>Course Gallery</h3>
                        <p>Curate global golf course profiles and reviews.</p>
                        <ArrowUpRight size={18} />
                    </Link>
                    <Link href="/admin/users" className={styles.actionCard}>
                        <h3>User Governance</h3>
                        <p>Manage community roles and access levels.</p>
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
