'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchMaintenanceStatus } from '@/lib/api';
import Image from 'next/image';
import styles from './MaintenanceGuard.module.css';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function useCountdown(endTime: string | null): TimeLeft | null {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        if (!endTime) {
            setTimeLeft(null);
            return;
        }

        const target = new Date(endTime).getTime();

        const tick = () => {
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };

        tick(); // Run immediately
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return timeLeft;
}

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const pathname = usePathname();
    const [maintenance, setMaintenance] = useState(false);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    const timeLeft = useCountdown(endTime);

    useEffect(() => {
        const check = async () => {
            try {
                const data = await fetchMaintenanceStatus();
                setMaintenance(data.enabled);
                setEndTime(data.endTime || null);
            } catch (error) {
                console.error('Failed to check maintenance status:', error);
                // Keep previous state on error to avoid flickering/resetting
            } finally {
                setChecked(true);
            }
        };

        check();

        const interval = setInterval(check, 30000);
        return () => clearInterval(interval);
    }, []);

    const isAdmin = user?.role === 'ADMIN';
    const isLoginPage = pathname === '/login';

    if (!checked || authLoading) return null;

    if (maintenance && !isAdmin && !isLoginPage) {
        return (
            <div className={styles.overlay}>
                <div className={styles.authBackground} />

                <div className={styles.content}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/logo.png"
                            alt="The Golf Press"
                            width={240}
                            height={80}
                            className={styles.logoImage}
                            priority
                        />
                    </div>

                    <h1 className={styles.title}>Under Maintenance</h1>

                    <p className={styles.message}>
                        We&apos;re performing scheduled updates to improve your experience.
                        <br />The Golf Press will return shortly.
                    </p>

                    {/* Countdown Timer */}
                    {timeLeft && (
                        <div className={styles.countdown}>
                            <div className={styles.countdownUnit}>
                                <span className={styles.countdownNumber}>
                                    {String(timeLeft.days).padStart(2, '0')}
                                </span>
                                <span className={styles.countdownLabel}>Days</span>
                            </div>
                            <span className={styles.countdownSep}>:</span>
                            <div className={styles.countdownUnit}>
                                <span className={styles.countdownNumber}>
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className={styles.countdownLabel}>Hours</span>
                            </div>
                            <span className={styles.countdownSep}>:</span>
                            <div className={styles.countdownUnit}>
                                <span className={styles.countdownNumber}>
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className={styles.countdownLabel}>Minutes</span>
                            </div>
                            <span className={styles.countdownSep}>:</span>
                            <div className={styles.countdownUnit}>
                                <span className={styles.countdownNumber}>
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                                <span className={styles.countdownLabel}>Seconds</span>
                            </div>
                        </div>
                    )}

                    <div className={styles.progressTrack}>
                        <div className={styles.progressBar}></div>
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.brand}>THE GOLF PRESS &copy; {new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {maintenance && isAdmin && (
                <div className={styles.adminBanner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Maintenance Mode is <strong>ACTIVE</strong> — Site is hidden from visitors.</span>
                </div>
            )}
            {children}
        </>
    );
}
