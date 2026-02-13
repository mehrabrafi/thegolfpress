'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './Menu.module.css';
import { useAuth } from '@/context/AuthContext';
import { Instagram, Youtube, Facebook, Video, X } from 'lucide-react';

interface MenuProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

export default function Menu({ isOpen, toggleMenu }: MenuProps) {
    const { user, logout } = useAuth();

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <>
            <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={toggleMenu} />
            <div className={`${styles.menuContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <button className={styles.closeBtn} onClick={toggleMenu}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <Link href="/" className={styles.logoLink} onClick={toggleMenu}>
                        <img src="/logo.png" alt="The Golf Press" className={styles.menuLogo} />
                    </Link>
                </div>

                <div className={styles.mainNav}>
                    <Link href="/news" className={styles.navItem} onClick={toggleMenu}>
                        News
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                    <Link href="/guides-and-tips" className={styles.navItem} onClick={toggleMenu}>
                        Guides & Tips
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                    <Link href="/courses" className={styles.navItem} onClick={toggleMenu}>
                        Courses
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                    <Link href="/scores" className={styles.navItem} onClick={toggleMenu}>
                        Scores
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                    <Link href="/rankings" className={styles.navItem} onClick={toggleMenu}>
                        Rankings
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                </div>

                <div className={styles.authSection}>
                    <p className={styles.authTitle}>My Account</p>
                    {user ? (
                        <div className={styles.authButtons}>
                            <button onClick={logout} className={`${styles.loginBtn}`} style={{ width: '100%' }}>LOG OUT</button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/login" className={styles.loginBtn} onClick={toggleMenu}>LOG IN</Link>
                            <Link href="/signup" className={styles.signupBtn} onClick={toggleMenu}>SIGN UP</Link>
                        </div>
                    )}
                </div>



                <nav className={styles.footerNav}>
                    <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                    <Link href="/cookies-policy" className={styles.footerLink}>Cookies Policy</Link>
                </nav>

                <div className={styles.socialSection}>
                    <span className={styles.followText}>FOLLOW US</span>
                    <div className={styles.socialIcons}>
                        <Link href="#" className={styles.socialIcon}><Instagram size={24} /></Link>
                        <Link href="#" className={styles.socialIcon}><X size={24} /></Link>
                        <Link href="#" className={styles.socialIcon}><Youtube size={24} /></Link>
                        <Link href="#" className={styles.socialIcon}><Facebook size={24} /></Link>
                        <Link href="#" className={styles.socialIcon}><Video size={24} /></Link>
                    </div>
                </div>
            </div>
        </>
    );
}
