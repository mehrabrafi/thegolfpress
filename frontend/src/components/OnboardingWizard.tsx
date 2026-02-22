'use client';

import { useEffect, useState } from 'react';
import styles from './OnboardingWizard.module.css';
import { fetchAllPlayers, completeOnboarding, fetchCategories } from '@/lib/api';
import Image from 'next/image';

/* ── Static data ─────────────────────────────────────────────────── */

interface OnboardingWizardProps {
    onComplete: () => void;
    mode?: 'onboarding' | 'tune';
}

export default function OnboardingWizard({ onComplete, mode = 'onboarding' }: OnboardingWizardProps) {
    const [step, setStep] = useState<1 | 2 | 3>(mode === 'tune' ? 1 : 1);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedSubTags, setSelectedSubTags] = useState<string[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const getInitials = (name: string) => {
        if (!name) return "";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [playersData, catsData] = await Promise.all([
                    fetchAllPlayers(),
                    fetchCategories()
                ]);
                setPlayers(Array.isArray(playersData) ? playersData.slice(0, 15) : []);
                setCategories(Array.isArray(catsData) ? catsData : []);
            } catch (err) {
                console.error("Failed to load onboarding data", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const toggleCat = (slug: string) => {
        setSelectedCats(prev => {
            const isActive = prev.includes(slug);
            if (isActive) {
                // Also clear sub-tags for this category
                const cat = categories.find(c => c.slug === slug);
                if (cat?.subTags) {
                    const subNames = cat.subTags.map((s: any) => s.name);
                    setSelectedSubTags(old => old.filter(n => !subNames.includes(n)));
                }
                return prev.filter(s => s !== slug);
            } else {
                return [...prev, slug];
            }
        });
    };

    const toggleSubTag = (name: string) => {
        setSelectedSubTags(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    };

    const togglePlayer = (id: string) =>
        setSelectedPlayers(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

    const handleFinish = async () => {
        setSubmitting(true);
        try {
            const allPrefs = [...selectedCats, ...selectedSubTags];
            await completeOnboarding(allPrefs, selectedPlayers);
        } catch (err) {
            console.error("Failed to finish onboarding", err);
        } finally {
            setSubmitting(false);
            setStep(3);
        }
    };

    return (
        <div className={styles.overlay}>
            {/* Left Panel with Background Image */}
            <div className={styles.leftPanel}>
                <Image
                    src="/onboarding-bg.png"
                    alt="Golf Onboarding"
                    fill
                    className={styles.bgImage}
                    priority
                />
            </div>

            {/* Right Panel with Content */}
            <div className={styles.rightPanel}>
                <button className={styles.closeBtn} onClick={onComplete}>×</button>

                <div className={styles.branding}>
                    <h1 className={styles.title}>{mode === 'onboarding' ? 'Welcome to The Golf Press' : 'Tune Your Feed'}</h1>
                    <p className={styles.subtitle}>
                        {mode === 'onboarding'
                            ? "Let's find you some starting news and followed players to get you started."
                            : "Update your interests and favorite players to refresh your personalized feed."}
                    </p>
                </div>

                <div className={styles.progressDots}>
                    <div className={`${styles.dot} ${step === 1 ? styles.dotActive : ''}`} />
                    <div className={`${styles.dot} ${step === 2 ? styles.dotActive : ''}`} />
                    <div className={`${styles.dot} ${step === 3 ? styles.dotActive : ''}`} />
                </div>

                <div className={styles.stepContent}>
                    {step === 1 && (
                        <>
                            <h2 className={styles.stepHeading}>What's your interest in Golf?</h2>
                            {loading ? (
                                <p>Loading categories...</p>
                            ) : (
                                <>
                                    <div className={styles.chipsGrid}>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                className={`${styles.chip} ${selectedCats.includes(cat.slug) ? styles.chipActive : ''}`}
                                                onClick={() => toggleCat(cat.slug)}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Deep Selection / Sub-tags Section */}
                                    {categories.some(cat => selectedCats.includes(cat.slug) && cat.subTags && cat.subTags.length > 0) && (
                                        <div className={styles.subSelectionArea}>
                                            {categories
                                                .filter(cat => selectedCats.includes(cat.slug) && cat.subTags && cat.subTags.length > 0)
                                                .map(cat => (
                                                    <div key={cat.id} className={styles.subGroup}>
                                                        <h3 className={styles.subGroupTitle}>Specific {cat.name} Topics:</h3>
                                                        <div className={styles.subChipsGrid}>
                                                            {cat.subTags.map((sub: any) => (
                                                                <button
                                                                    key={sub.id}
                                                                    className={`${styles.subChip} ${selectedSubTags.includes(sub.name) ? styles.subChipActive : ''}`}
                                                                    onClick={() => toggleSubTag(sub.name)}
                                                                >
                                                                    {sub.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className={styles.stepHeading}>Follow your favorite players</h2>
                            {loading ? (
                                <p>Loading players...</p>
                            ) : (
                                <div className={styles.playersGrid}>
                                    {players.map(player => (
                                        <div
                                            key={player.id}
                                            className={`${styles.playerCard} ${selectedPlayers.includes(player.id) ? styles.playerSelected : ''}`}
                                            onClick={() => togglePlayer(player.id)}
                                        >
                                            <div className={styles.avatarWrapper}>
                                                {!imageErrors[player.id] && player.image ? (
                                                    <img
                                                        src={player.image}
                                                        alt={player.name}
                                                        className={styles.playerAvatar}
                                                        onError={() => setImageErrors(prev => ({ ...prev, [player.id]: true }))}
                                                    />
                                                ) : (
                                                    <div className={styles.avatarFallback}>
                                                        {getInitials(player.name)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={styles.playerName}>{player.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <div className={styles.successWrap}>
                            <span className={styles.successIcon}>⛳️</span>
                            <h2 className={styles.successTitle}>You're All Set!</h2>
                            <p className={styles.successSubtitle}>We've customized your experience based on your preferences. Enjoy the latest in golf.</p>
                            <button className={styles.nextBtn} onClick={onComplete}>Close & Explore</button>
                        </div>
                    )}
                </div>

                {step !== 3 && (
                    <div className={styles.actions}>
                        <button className={styles.skipBtn} onClick={onComplete}>Skip All</button>
                        {step === 1 ? (
                            <button className={styles.nextBtn} onClick={() => setStep(2)}>Next Step</button>
                        ) : (
                            <button
                                className={styles.nextBtn}
                                onClick={handleFinish}
                                disabled={submitting}
                            >
                                {submitting ? 'Finishing...' : 'Complete Setup'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
