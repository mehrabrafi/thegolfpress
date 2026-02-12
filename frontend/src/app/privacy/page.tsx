'use client';

import styles from './privacy.module.css';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: February 12, 2026</p>
                </div>
            </section>

            {/* Content Section */}
            <div className={styles.contentWrapper}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Introduction</h2>
                    <p className={styles.text}>
                        Welcome to <strong>The Golf Press</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you visit our website, use our mobile applications, or interact with our digital services.
                    </p>
                    <p className={styles.text}>
                        By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, your choice is not to use our website.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
                    <p className={styles.text}>
                        We collect information that identifies, relates to, describes, or could reasonably be linked, directly or indirectly, with a particular consumer or device.
                    </p>
                    <h3 className={styles.subTitle}>Information You Provide to Us</h3>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Account Information:</strong> Name, email address, and password when you register for an account.</li>
                        <li className={styles.listItem}><strong>Profile Information:</strong> Preferences, handicap, favorite courses, or professional golfer interests.</li>
                        <li className={styles.listItem}><strong>Communications:</strong> Information you provide when contacting us for support or inquiries.</li>
                    </ul>
                    <h3 className={styles.subTitle}>Information Collected Automatically</h3>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and search terms.</li>
                        <li className={styles.listItem}><strong>Device Information:</strong> IP address, browser type, operating system, and unique device identifiers.</li>
                        <li className={styles.listItem}><strong>Location Data:</strong> General location derived from your IP address.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
                    <p className={styles.text}>
                        We use the information we collect for various purposes, including:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>To provide and maintain our Service, including to monitor usage.</li>
                        <li className={styles.listItem}>To manage your Account: to manage your registration as a user.</li>
                        <li className={styles.listItem}>To deliver personalized content, rankings, and golf news.</li>
                        <li className={styles.listItem}>To provide you with news, special offers, and general information about other goods, services, and events.</li>
                        <li className={styles.listItem}>To gather analysis or valuable information so that we can improve our website.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Data Sharing & Third Parties</h2>
                    <p className={styles.text}>
                        We may share your personal information in the following situations:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Service Providers:</strong> We share information with vendors who perform services for us (e.g., email delivery, data analysis).</li>
                        <li className={styles.listItem}><strong>Advertisers:</strong> We may share hashed data or device identifiers with advertising partners to show you relevant golf-related ads.</li>
                        <li className={styles.listItem}><strong>Compliance with Laws:</strong> We may disclose information where required by law or to protect our rights.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Your Rights & Choices</h2>
                    <p className={styles.text}>
                        Depending on your location (such as if you are in the EU or California), you may have certain rights regarding your personal information:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>The right to access, update, or delete the information we have on you.</li>
                        <li className={styles.listItem}>The right of rectification.</li>
                        <li className={styles.listItem}>The right to object to processing.</li>
                        <li className={styles.listItem}>The right to data portability.</li>
                    </ul>
                    <p className={styles.text}>
                        To exercise these rights, please contact us using the information provided below.
                    </p>
                </section>

                <div className={styles.contactBox}>
                    <h2 className={styles.sectionTitle}>6. Contact Us</h2>
                    <p className={styles.text}>
                        If you have any questions about this Privacy Policy, please contact our Editorial team:
                    </p>
                    <p className={styles.text}>
                        Email: <a href="mailto:privacy@thegolfpress.com" className={styles.link}>privacy@thegolfpress.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
