'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { Instagram, Youtube, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.topSection}>
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            TheGolfPress
                        </Link>
                        <p className={styles.description}>
                            The definitive voice in golf, delivering real-time scores, expert instruction, and premium news.
                        </p>
                        <div className={styles.monogram}>
                            T . G . P
                        </div>
                    </div>

                    <div className={styles.linksCol}>
                        <h4>Navigation</h4>
                        <ul>
                            <li><Link href="/news">News</Link></li>
                            <li><Link href="/how-to">How To</Link></li>
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
                                <Link href="#" className={styles.socialIconItem} aria-label="Instagram">
                                    <span className={styles.iconCircle}><Instagram size={14} /></span>
                                    <span className={styles.platformName}>Instagram</span>
                                </Link>
                                <Link href="#" className={styles.socialIconItem} aria-label="Twitter">
                                    <span className={styles.iconCircle}><Twitter size={14} /></span>
                                    <span className={styles.platformName}>Twitter</span>
                                </Link>
                                <Link href="#" className={styles.socialIconItem} aria-label="Facebook">
                                    <span className={styles.iconCircle}><Facebook size={14} /></span>
                                    <span className={styles.platformName}>Facebook</span>
                                </Link>
                                <Link href="#" className={styles.socialIconItem} aria-label="Youtube">
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
                                <a href="mailto:editor@thegolfpress.com" className={styles.inquiryEmail}>editor@thegolfpress.com</a>
                            </div>
                        </div>
                        <div className={styles.inquiryItem}>
                            <span className={styles.inquiryLabel}>ADVERTISING</span>
                            <div className={styles.emailWrapper}>
                                <Mail size={14} className={styles.mailIcon} />
                                <a href="mailto:ads@thegolfpress.com" className={styles.inquiryEmail}>ads@thegolfpress.com</a>
                            </div>
                        </div>
                        <div className={styles.inquiryItem}>
                            <span className={styles.inquiryLabel}>PARTNERSHIPS</span>
                            <div className={styles.emailWrapper}>
                                <Mail size={14} className={styles.mailIcon} />
                                <a href="mailto:partners@thegolfpress.com" className={styles.inquiryEmail}>partners@thegolfpress.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <div className={styles.copyright}>
                        &copy; {new Date().getFullYear()} TheGolfPress. All rights reserved.
                    </div>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
