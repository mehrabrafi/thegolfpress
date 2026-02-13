'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchSearch } from '@/lib/api';
import styles from './SearchOverlay.module.css';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
        } else {
            setQuery('');
            setResults(null);
            setHasSearched(false);
        }
    }, [isOpen]);

    // Keyboard shortcut: Escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
            // Cmd/Ctrl + K to toggle
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Debounced search
    const doSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
            setResults(null);
            setHasSearched(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await fetchSearch(searchQuery);
            setResults(data);
            setHasSearched(true);
        } catch (err) {
            console.error('Search error:', err);
            setResults({ news: [], categories: [], players: [] });
            setHasSearched(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            doSearch(value);
        }, 350);
    };

    const handleClear = () => {
        setQuery('');
        setResults(null);
        setHasSearched(false);
        inputRef.current?.focus();
    };

    const handleResultClick = () => {
        onClose();
    };

    const totalResults =
        (results?.news?.length || 0) +
        (results?.players?.length || 0) +
        (results?.categories?.length || 0);

    return (
        <div
            className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <div className={styles.searchContainer}>
                {/* Search Input */}
                <div className={styles.inputWrapper}>
                    <svg className={styles.searchIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search news, players, topics..."
                        value={query}
                        onChange={handleInputChange}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    {query && (
                        <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Results */}
                <div className={styles.resultsArea}>
                    {/* Loading State */}
                    {loading && (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner} />
                        </div>
                    )}

                    {/* Initial State */}
                    {!loading && !hasSearched && !query && (
                        <div className={styles.initialState}>
                            <div className={styles.initialIcon}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <p className={styles.initialTitle}>Search The Golf Press</p>
                            <p className={styles.initialHint}>Find news articles, golf players, and more</p>
                            <div className={styles.shortcuts}>
                                <span className={styles.shortcutKey}>ESC to close</span>
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && hasSearched && totalResults === 0 && (
                        <div className={styles.noResults}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                            <p className={styles.noResultsTitle}>No results found</p>
                            <p className={styles.noResultsHint}>Try different keywords or check spelling</p>
                        </div>
                    )}

                    {/* Results Sections */}
                    {!loading && hasSearched && totalResults > 0 && (
                        <>
                            {/* News Results */}
                            {results.news?.length > 0 && (
                                <div className={styles.resultSection}>
                                    <div className={styles.sectionHeader}>
                                        <span className={styles.sectionLabel}>Articles</span>
                                        <span className={styles.sectionCount}>{results.news.length} found</span>
                                    </div>
                                    {results.news.map((article: any) => (
                                        <Link
                                            key={article.id}
                                            href={`/news/${article.id}`}
                                            className={styles.newsItem}
                                            onClick={handleResultClick}
                                        >
                                            <div className={styles.newsThumb}>
                                                {article.image && (
                                                    <img src={article.image} alt="" loading="lazy" />
                                                )}
                                            </div>
                                            <div className={styles.newsInfo}>
                                                <div className={styles.newsCategory}>{article.category}</div>
                                                <div className={styles.newsTitle}>{article.title}</div>
                                                <div className={styles.newsExcerpt}>{article.excerpt}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Player Results */}
                            {results.players?.length > 0 && (
                                <div className={styles.resultSection}>
                                    <div className={styles.sectionHeader}>
                                        <span className={styles.sectionLabel}>Players</span>
                                        <span className={styles.sectionCount}>{results.players.length} found</span>
                                    </div>
                                    {results.players.map((player: any) => (
                                        <Link
                                            key={player.id}
                                            href={`/players/${player.id}`}
                                            className={styles.playerItem}
                                            onClick={handleResultClick}
                                        >
                                            <div className={styles.playerAvatar}>
                                                {player.image ? (
                                                    <img src={player.image} alt={player.name} loading="lazy" />
                                                ) : (
                                                    <div className={styles.playerAvatarPlaceholder}>
                                                        {player.name?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.playerInfo}>
                                                <div className={styles.playerName}>{player.name}</div>
                                                {player.country && (
                                                    <div className={styles.playerCountry}>{player.country}</div>
                                                )}
                                            </div>
                                            <svg className={styles.playerArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Category Results */}
                            {results.categories?.length > 0 && (
                                <div className={styles.resultSection}>
                                    <div className={styles.sectionHeader}>
                                        <span className={styles.sectionLabel}>Categories</span>
                                        <span className={styles.sectionCount}>{results.categories.length} found</span>
                                    </div>
                                    {results.categories.map((cat: any) => (
                                        <Link
                                            key={cat.id}
                                            href={`/${cat.slug}`}
                                            className={styles.categoryItem}
                                            onClick={handleResultClick}
                                        >
                                            <div className={styles.categoryIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                                                </svg>
                                            </div>
                                            <div className={styles.categoryInfo}>
                                                <div className={styles.categoryName}>{cat.name}</div>
                                                <div className={styles.categoryCount}>
                                                    {cat._count?.news || 0} articles
                                                    {cat.subTags?.length > 0 && ` · ${cat.subTags.length} sub-tags`}
                                                </div>
                                            </div>
                                            <svg className={styles.playerArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
