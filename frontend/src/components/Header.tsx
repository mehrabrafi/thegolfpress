'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext';
import Menu from './Menu';

export default function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    const isHome = pathname === '/';

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    // Scrolling down
                    setIsVisible(false);
                } else {
                    // Scrolling up
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader);
            return () => {
                window.removeEventListener('scroll', controlHeader);
            };
        }
    }, [lastScrollY]);

    // Get current section name for sub-pages header
    const getSectionName = () => {
        if (pathname === '/') return '';
        const parts = pathname.split('/');
        const firstPart = parts[1];
        return firstPart.replace(/-/g, ' ').toUpperCase();
    };

    const sectionName = getSectionName();

    return (
        <header className={`${styles.header} ${!isHome ? styles.categoryHeader : ''} ${!isVisible ? styles.headerHidden : ''}`}>
            <Menu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />

            {isHome ? (
                <>
                    {/* Home Header - Row 1: Branding & Auth */}
                    <div className={`container ${styles.topBar}`}>
                        <div className={styles.authLeft}>
                        </div>

                        <Link href="/" className={styles.logo}>
                            <img src="/logo.png" alt="The Golf Press" className={styles.logoImage} />
                        </Link>

                        <div className={styles.authRight}>
                            {user?.role === 'ADMIN' && (
                                <Link href="/admin" className={styles.adminPanelLink}>ADMIN PANEL</Link>
                            )}
                        </div>
                    </div>

                    {/* Home Header - Row 2: Navigation */}
                    <div className={styles.navBarWrapper}>
                        <div className={`container ${styles.navBar}`}>
                            <div className={styles.menuItem} onClick={() => setIsMenuOpen(true)}>
                                <div className={styles.hamburger}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <span className={styles.menuText}>MENU</span>
                            </div>

                            <nav className={styles.nav}>
                                <Link href="/news">NEWS</Link>
                                <Link href="/how-to">HOW TO</Link>
                                <Link href="/courses">COURSES</Link>
                                <Link href="/scores">SCORES</Link>

                                <Link href="/rankings">RANKINGS</Link>
                            </nav>

                            <div className={styles.searchItem}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Category Page Header - Single Row */
                <div className={`container ${styles.catHeaderContent}`}>
                    <div className={styles.catHeaderLeft}>
                        <div className={styles.menuItem} onClick={() => setIsMenuOpen(true)}>
                            <div className={styles.hamburger}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <span className={styles.sectionTitle}>{sectionName}</span>
                    </div>

                    <Link href="/" className={styles.logoSmall}>
                        <img src="/logo.png" alt="The Golf Press" className={styles.logoImageSmall} />
                    </Link>

                    <div className={styles.catHeaderRight}>
                        {user?.role === 'ADMIN' && (
                            <Link href="/admin" className={styles.adminPanelLinkSmall}>ADMIN PANEL</Link>
                        )}
                        <div className={styles.searchItem}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
