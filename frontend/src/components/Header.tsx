'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext';
import SearchOverlay from './SearchOverlay';

function HeaderContent() {
    const { user, logout } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);
    const [subTags, setSubTags] = useState<any[]>([]);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isUserMenuOpen && !target.closest(`.${styles.userMenuContainer}`)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader);
            return () => window.removeEventListener('scroll', controlHeader);
        }
    }, [lastScrollY]);

    useEffect(() => {
        const controller = new AbortController();
        const loadCategories = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || '/api'}/golf/categories`,
                    { signal: controller.signal }
                );
                if (!res.ok) return;
                const data = await res.json();
                setCategories(data);
            } catch (e: any) {
                if (e?.name !== 'AbortError') {
                    // Silently fall back to empty categories
                }
            }
        };
        loadCategories();
        return () => controller.abort();
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
        const categorySlug = parts[1];

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

    return (
        <header className={`${styles.header} ${!isVisible ? styles.headerHidden : ''}`}>
            {/* Single Dark Nav Bar */}
            <div className={styles.navBar}>
                <div className={`container ${styles.navBarInner}`}>
                    {/* Logo Left */}
                    <Link href="/" className={styles.navLogo}>
                        <Image src="/logo.png" alt="The Golf Press" width={200} height={60} className={styles.navLogoImage} priority />
                    </Link>

                    {/* Center Nav Links */}
                    <nav className={styles.nav}>
                        <Link href="/news" className={pathname.startsWith('/news') ? styles.navLinkActive : ''}>NEWS</Link>
                        <Link href="/guides-and-tips" className={pathname.startsWith('/guides-and-tips') ? styles.navLinkActive : ''}>GUIDES & TIPS</Link>
                        <Link href="/courses" className={pathname.startsWith('/courses') ? styles.navLinkActive : ''}>COURSES</Link>
                        <Link href="/equipment" className={pathname.startsWith('/equipment') ? styles.navLinkActive : ''}>EQUIPMENT</Link>
                        <Link href="/lifestyle" className={pathname.startsWith('/lifestyle') ? styles.navLinkActive : ''}>LIFESTYLE</Link>
                        <Link href="/scores" className={pathname.startsWith('/scores') ? styles.navLinkActive : ''}>SCORES</Link>
                        <Link href="/rankings" className={pathname.startsWith('/rankings') ? styles.navLinkActive : ''}>RANKINGS</Link>
                        <Link href="/players" className={pathname.startsWith('/players') ? styles.navLinkActive : ''}>PLAYERS</Link>
                        {user && (
                            <Link href="/my-feed" className={pathname.startsWith('/my-feed') ? styles.navLinkActive : ''}>MY FEED</Link>
                        )}
                    </nav>

                    {/* Right Actions */}
                    <div className={styles.navRight}>
                        {user?.role === 'ADMIN' && (
                            <Link href="/tgpadmin" className={styles.adminLink}>ADMIN</Link>
                        )}

                        <button className={styles.searchBtn} onClick={() => setIsSearchOpen(true)} aria-label="Open search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </button>

                        {!user ? (
                            <Link href="/login" className={styles.authLink}>LOG IN</Link>
                        ) : (
                            <div className={styles.userMenuContainer}>
                                <button
                                    className={styles.userBtn}
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    aria-haspopup="true"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <div className={styles.avatar}>
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt="Profile"
                                                width={28}
                                                height={28}
                                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            user.name ? user.name.charAt(0) : user.email.charAt(0)
                                        )}
                                    </div>
                                    <span className={styles.userName}>{user.name || 'Account'}</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', opacity: 0.5 }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>

                                {isUserMenuOpen && (
                                    <div className={styles.dropdown}>
                                        <div className={styles.dropdownHeader}>
                                            <span className={styles.userName}>{user.name || 'User'}</span>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </div>

                                        <Link href="/profile" className={styles.dropdownItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            Edit Profile
                                        </Link>

                                        <Link href="/my-feed" className={styles.dropdownItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                            My Feed
                                        </Link>

                                        {user?.role === 'ADMIN' && (
                                            <Link href="/tgpadmin" className={styles.dropdownItem}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                                                Admin Panel
                                            </Link>
                                        )}

                                        <button onClick={logout} className={`${styles.dropdownItem} ${styles.logout}`}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sub-Navigation Row */}
            {subTags.length > 0 && (
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
