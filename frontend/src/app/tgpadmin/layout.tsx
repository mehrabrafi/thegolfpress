'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Newspaper,
    Tags,
    BookOpen,
    Flag,
    LayoutTemplate,
    Users,
    Settings,
    Wrench,
    LogOut,
    BarChart3,
    Trophy,
    Sparkles,
} from 'lucide-react';
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
                    <Link href="/tgpadmin" className={styles.navItem} prefetch={false}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/tgpadmin/analytics" className={styles.navItem} prefetch={false}>
                        <BarChart3 size={18} /> Content Analytics
                    </Link>
                    <Link href="/tgpadmin/news" className={styles.navItem} prefetch={false}>
                        <Newspaper size={18} /> Manage News
                    </Link>
                    <Link href="/tgpadmin/categories" className={styles.navItem} prefetch={false}>
                        <Tags size={18} /> Manage Categories
                    </Link>
                    <Link href="/tgpadmin/guides-and-tips" className={styles.navItem} prefetch={false}>
                        <BookOpen size={18} /> Manage Guides & Tips
                    </Link>
                    <Link href="/tgpadmin/courses" className={styles.navItem} prefetch={false}>
                        <Flag size={18} /> Manage Courses
                    </Link>
                    <Link href="/tgpadmin/equipment" className={styles.navItem} prefetch={false}>
                        <Wrench size={18} /> Manage Equipment
                    </Link>
                    <Link href="/tgpadmin/lifestyle" className={styles.navItem} prefetch={false}>
                        <Sparkles size={18} /> Manage Lifestyle
                    </Link>
                    <Link href="/tgpadmin/players" className={styles.navItem} prefetch={false}>
                        <Trophy size={18} /> Manage Players
                    </Link>
                    <Link href="/tgpadmin/users" className={styles.navItem} prefetch={false}>
                        <Users size={18} /> Users
                    </Link>
                    <Link href="/tgpadmin/settings" className={styles.navItem} prefetch={false}>
                        <Settings size={18} /> Site Settings
                    </Link>
                    <Link href="/tgpadmin/settings" className={styles.navItemMaintenance} prefetch={false}>
                        <Wrench size={18} /> Maintenance Mode
                    </Link>
                    <div className={styles.navDivider}></div>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={18} /> Logout
                    </button>
                </nav>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
