'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { Instagram, Youtube, Facebook, Twitter, Mail } from 'lucide-react';
import { fetchSettings } from '@/lib/api';

export default function Footer() {
    const [settings, setSettings] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchSettings();
                setSettings(data);
            } catch (e) {
                console.error('Footer settings load error', e);
            }
        }
        load();
    }, []);

    const getVal = (key: string, fallback: string) => settings.find(s => s.key === key)?.value || fallback;

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.topSection}>
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.footerLogo}>
                            <Image src="/logo.png" alt={getVal('site_name', 'The Golf Press')} width={180} height={50} className={styles.logoImage} />
                        </Link>
                        <p className={styles.description}>
                            {getVal('site_description', 'The definitive voice in golf, delivering real-time scores, expert instruction, and premium news.')}
                        </p>
                    </div>

                    <div className={styles.linksCol}>
                        <h4>Navigation</h4>
                        <ul>
                            <li><Link href="/news">News</Link></li>
                            <li><Link href="/guides-and-tips">Guides & Tips</Link></li>
                            <li><Link href="/courses">Courses</Link></li>
                            <li><Link href="/scores">Scores</Link></li>
                            <li><Link href="/schedule">Schedule</Link></li>
                            <li><Link href="/rankings">Rankings</Link></li>
                            <li><Link href="/players">Players</Link></li>
                            <li><Link href="/news?category=EQUIPMENT">Equipment</Link></li>
                        </ul>
                    </div>

                    <div className={styles.connectCol}>
                        <div className={styles.socialSection}>
                            <h4>Connect</h4>
                            <div className={styles.socialIcons}>
                                <a href={getVal('social_instagram', '#')} className={styles.socialIconItem} target="_blank" rel="noopener noreferrer">
                                    <span className={styles.iconCircle}><Instagram size={14} /></span>
                                    <span className={styles.platformName}>Instagram</span>
                                </a>
                                <a href={getVal('social_twitter', '#')} className={styles.socialIconItem} target="_blank" rel="noopener noreferrer">
                                    <span className={styles.iconCircle}><Twitter size={14} /></span>
                                    <span className={styles.platformName}>Twitter</span>
                                </a>
                                <a href={getVal('social_facebook', '#')} className={styles.socialIconItem} target="_blank" rel="noopener noreferrer">
                                    <span className={styles.iconCircle}><Facebook size={14} /></span>
                                    <span className={styles.platformName}>Facebook</span>
                                </a>
                                <Link href="#" className={styles.socialIconItem}>
                                    <span className={styles.iconCircle}><Youtube size={14} /></span>
                                    <span className={styles.platformName}>YouTube</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactCol}>
                        <h4>Inquiries</h4>
                        <div className={styles.inquiryItem}>
                            <span className={styles.inquiryLabel}>EDITORIAL</span>
                            <div className={styles.emailWrapper}>
                                <Mail size={14} className={styles.mailIcon} />
                                <a href={`mailto:${getVal('contact_email_editorial', 'editor@thegolfpress.com')}`} className={styles.inquiryEmail}>{getVal('contact_email_editorial', 'editor@thegolfpress.com')}</a>
                            </div>
                        </div>
                        <div className={styles.inquiryItem}>
                            <span className={styles.inquiryLabel}>ADVERTISING</span>
                            <div className={styles.emailWrapper}>
                                <Mail size={14} className={styles.mailIcon} />
                                <a href={`mailto:${getVal('contact_email_ads', 'ads@thegolfpress.com')}`} className={styles.inquiryEmail}>{getVal('contact_email_ads', 'ads@thegolfpress.com')}</a>
                            </div>
                        </div>
                        <div className={styles.inquiryItem}>
                            <span className={styles.inquiryLabel}>SUPPORT</span>
                            <div className={styles.emailWrapper}>
                                <Mail size={14} className={styles.mailIcon} />
                                <a href={`mailto:${getVal('contact_email_support', 'support@thegolfpress.com')}`} className={styles.inquiryEmail}>{getVal('contact_email_support', 'support@thegolfpress.com')}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <div className={styles.copyright}>
                        &copy; {new Date().getFullYear()} {getVal('site_name', 'The Golf Press')}. All rights reserved.
                    </div>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/cookies-policy">Cookies Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
