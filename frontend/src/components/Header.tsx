'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext';
import Menu from './Menu';
import SearchOverlay from './SearchOverlay';
import { fetchCategories } from '@/lib/api';

function HeaderContent() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);
    const [subTags, setSubTags] = useState<any[]>([]);
    const pathname = usePathname();
    const searchParams = useSearchParams();

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

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error loading header categories:', error);
            }
        };
        loadCategories();
    }, []);

    // Global keyboard shortcut: Cmd/Ctrl+K to open search
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    const handleSearchClose = useCallback(() => {
        setIsSearchOpen(false);
    }, []);

    useEffect(() => {
        const parts = pathname.split('/');
        const categorySlug = parts[1]; // e.g., 'how-to'

        if (categorySlug) {
            const matchedCat = categories.find(c => c.slug === categorySlug);
            if (matchedCat && matchedCat.subTags) {
                setSubTags(matchedCat.subTags);
            } else {
                setSubTags([]);
            }
        } else {
            setSubTags([]);
        }
    }, [pathname, categories]);

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
                                <Link href="/tgpadmin" className={styles.adminPanelLink}>ADMIN PANEL</Link>
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
                                <Link href="/guides-and-tips">GUIDES & TIPS</Link>
                                <Link href="/courses">COURSES</Link>
                                <Link href="/scores">SCORES</Link>

                                <Link href="/rankings">RANKINGS</Link>
                            </nav>

                            <div className={styles.searchItem} onClick={() => setIsSearchOpen(true)}>
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
                            <Link href="/tgpadmin" className={styles.adminPanelLinkSmall}>ADMIN PANEL</Link>
                        )}
                        <div className={styles.searchItem} onClick={() => setIsSearchOpen(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-Navigation Row - Integrated into Header */}
            {!isHome && subTags.length > 0 && (
                <div className={styles.subNavBar}>
                    <div className={`container ${styles.subNavContent}`}>
                        <nav className={styles.subNav}>
                            <Link
                                href={`/${pathname.split('/')[1]}`}
                                className={`${styles.subNavLink} ${pathname === `/${pathname.split('/')[1]}` && !searchParams.get('tag') ? styles.subNavLinkActive : ''}`}
                            >
                                ALL
                            </Link>
                            {subTags.map((tag: any) => {
                                const tagSlug = tag.name.toLowerCase().replace(/ /g, '-');
                                const parentSlug = pathname.split('/')[1];

                                // News section uses query params to avoid conflict with /news/[id] article route
                                const fullPath = parentSlug === 'news'
                                    ? `/news?tag=${tagSlug}`
                                    : `/${parentSlug}/${tagSlug}`;

                                const isActive = parentSlug === 'news'
                                    ? pathname === '/news' && searchParams.get('tag') === tagSlug
                                    : pathname === fullPath;

                                return (
                                    <Link
                                        key={tag.id}
                                        href={fullPath}
                                        className={`${styles.subNavLink} ${isActive ? styles.subNavLinkActive : ''}`}
                                    >
                                        {tag.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
        </header>
    );
}

export default function Header() {
    return (
        <Suspense fallback={null}>
            <HeaderContent />
        </Suspense>
    );
}
