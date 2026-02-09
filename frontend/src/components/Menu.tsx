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
                    <Link href="/" className={styles.logo} onClick={toggleMenu}>
                        TheGolfPress
                    </Link>
                </div>

                <div className={styles.mainNav}>
                    <Link href="/how-to" className={styles.navItem} onClick={toggleMenu}>
                        How To
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                    <Link href="/equipment" className={styles.navItem} onClick={toggleMenu}>
                        Equipment
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                    <Link href="/courses" className={styles.navItem} onClick={toggleMenu}>
                        Courses
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                    <Link href="/news" className={styles.navItem} onClick={toggleMenu}>
                        News
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
                    <Link href="/videos" className={styles.navItem} onClick={toggleMenu}>
                        Videos
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                </div>

                <div className={styles.authSection}>
                    <p className={styles.authTitle}>My The Golf Press Account</p>
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

                <div className={styles.brandSection}>
                    <span className={styles.brandLabel}>Sign Up</span>
                    <div className={styles.plusBrand}>TheGolfPress<span className={styles.plus}>+</span></div>
                </div>

                <nav className={styles.secondaryNav}>
                    <Link href="/newsletter" className={styles.secondaryLink}>Newsletter Sign-up</Link>
                    <Link href="/archive" className={styles.secondaryLink}>The Golf Press Archive</Link>
                    <Link href="/instruction" className={styles.secondaryLink}>Instruction Certification</Link>
                    <Link href="/fitness" className={styles.secondaryLink}>Fitness Trainer Certification</Link>
                    <Link href="/directory" className={styles.secondaryLink}>Certification Directory</Link>
                    <Link href="/open" className={styles.secondaryLink}>The Golf Press Open</Link>
                    <Link href="/partner" className={styles.secondaryLink}>TGP+ Partner Offers</Link>
                </nav>

                <nav className={styles.footerNav}>
                    <Link href="/contact" className={styles.footerLink}>Contact</Link>
                    <Link href="/privacy" className={styles.footerLink}>Privacy & Cookies Notice</Link>
                    <Link href="/visitor" className={styles.footerLink}>Visitor Agreement</Link>
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
