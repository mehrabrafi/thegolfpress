'use client';

import styles from '../privacy/privacy.module.css'; // Reuse the same styles
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Terms of Service</h1>
                    <p className={styles.lastUpdated}>Last Updated: February 12, 2026</p>
                </div>
            </section>

            {/* Content Section */}
            <div className={styles.contentWrapper}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
                    <p className={styles.text}>
                        By accessing and using <strong>The.Golf.Press</strong>, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                    <p className={styles.text}>
                        ANY PARTICIPATION IN THIS SITE WILL CONSTITUTE ACCEPTANCE OF THIS AGREEMENT. IF YOU DO NOT AGREE TO ABIDE BY THE ABOVE, PLEASE DO NOT USE THIS SITE.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Use of License</h2>
                    <p className={styles.text}>
                        Permission is granted to temporarily download one copy of the materials (information or software) on The.Golf.Press's website for personal, non-commercial transitory viewing only.
                    </p>
                    <p className={styles.text}>
                        This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>Modify or copy the materials;</li>
                        <li className={styles.listItem}>Use the materials for any commercial purpose, or for any public display;</li>
                        <li className={styles.listItem}>Attempt to decompile or reverse engineer any software contained on the website;</li>
                        <li className={styles.listItem}>Remove any copyright or other proprietary notations from the materials;</li>
                        <li className={styles.listItem}>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Content Disclaimer</h2>
                    <p className={styles.text}>
                        The materials on The.Golf.Press's website are provided on an 'as is' basis. The.Golf.Press makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                    <p className={styles.text}>
                        Further, The.Golf.Press does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Limitations of Liability</h2>
                    <p className={styles.text}>
                        In no event shall The.Golf.Press or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The.Golf.Press's website, even if The.Golf.Press or a The.Golf.Press authorized representative has been notified orally or in writing of the possibility of such damage.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. User Accounts</h2>
                    <p className={styles.text}>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p className={styles.text}>
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Governing Law</h2>
                    <p className={styles.text}>
                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which The.Golf.Press operates and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                </section>

                <div className={styles.contactBox}>
                    <h2 className={styles.sectionTitle}>7. Contacting Us</h2>
                    <p className={styles.text}>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className={styles.text}>
                        Email: <a href="mailto:legal@thegolfpress.com" className={styles.link}>legal@thegolfpress.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
