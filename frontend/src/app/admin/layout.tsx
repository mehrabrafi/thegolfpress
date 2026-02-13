'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ADMIN') {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'ADMIN') return <div className={styles.loading}>Loading Admin Panel...</div>;

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>Admin Panel</div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>Dashboard</Link>
                    <Link href="/admin/news" className={styles.navItem}>Manage News</Link>
                    <Link href="/admin/categories" className={styles.navItem}>Manage Categories</Link>
                    <Link href="/admin/guides-and-tips" className={styles.navItem}>Manage Guides & Tips</Link>
                    <Link href="/admin/courses" className={styles.navItem}>Manage Courses</Link>
                    <Link href="/admin/home-sections" className={styles.navItem}>Home Sections</Link>
                    <Link href="/admin/users" className={styles.navItem}>Users</Link>
                    <Link href="/admin/settings" className={styles.navItem}>Site Settings</Link>
                    <div className={styles.navDivider}></div>
                    <button onClick={logout} className={styles.logoutBtn}>Logout</button>
                </nav>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
