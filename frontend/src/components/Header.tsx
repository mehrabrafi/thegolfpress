'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <Link href="/" className={styles.logo}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                    <span>TheGolfPress</span>
                </Link>
                <nav className={styles.nav}>
                    <Link href="/news">News</Link>
                    <Link href="/scores">Live Scores</Link>
                    <Link href="/schedule">Schedule</Link>
                    <Link href="/rankings">Rankings</Link>
                    {user?.role === 'ADMIN' && <Link href="/admin">Admin</Link>}
                </nav>
                <div className={styles.actions}>
                    <div className={styles.searchWrapper}>
                        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input type="text" placeholder="Search..." className={styles.searchInput} />
                    </div>

                    {user ? (
                        <div className={styles.userMenu}>
                            <span className={styles.userLink}>{user.name || user.email.split('@')[0]}</span>
                            <button onClick={logout} className={styles.authBtn} style={{ background: '#e74c3c' }}>Logout</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link href="/login" className={styles.authBtn}>Login</Link>
                            <Link href="/signup" className={styles.authBtn} style={{ background: 'transparent', color: 'var(--text-color)', border: '1px solid #ddd' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
