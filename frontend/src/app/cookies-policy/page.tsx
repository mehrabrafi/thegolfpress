'use client';

import styles from '../privacy/privacy.module.css'; // Reuse privacy styles
import Link from 'next/link';

export default function CookiesPage() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Cookies Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: February 12, 2026</p>
                </div>
            </section>

            {/* Content Section */}
            <div className={styles.contentWrapper}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. What are Cookies?</h2>
                    <p className={styles.text}>
                        Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                    <p className={styles.text}>
                        For example, cookies can help us remember your preferences, keep you logged in between visits, and help us understand how you use our site so we can improve it.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. How We Use Cookies</h2>
                    <p className={styles.text}>
                        <strong>The Golf Press</strong> uses cookies and similar technologies to ensure you get the best experience on our website. We use them for several reasons, including:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>To keep our site secure and protect your data.</li>
                        <li className={styles.listItem}>To remember your preferences and settings.</li>
                        <li className={styles.listItem}>To analyze how you use our site so we can make improvements.</li>
                        <li className={styles.listItem}>To show you content and advertisements that are relevant to your interests.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Types of Cookies We Use</h2>
                    <h3 className={styles.subTitle}>Strictly Necessary Cookies</h3>
                    <p className={styles.text}>
                        These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site. Without these cookies, services like login sessions cannot be provided.
                    </p>

                    <h3 className={styles.subTitle}>Performance & Analytics Cookies</h3>
                    <p className={styles.text}>
                        These cookies collect information about how you use our website, for instance, which pages you go to most often. This data may be used to help optimize our website and make it easier for you to navigate.
                    </p>

                    <h3 className={styles.subTitle}>Functional Cookies</h3>
                    <p className={styles.text}>
                        These cookies allow our website to remember choices you make while browsing. For instance, we may store your geographic location in a cookie to ensure that we show you our website localized for your area.
                    </p>

                    <h3 className={styles.subTitle}>Advertising & Targeting Cookies</h3>
                    <p className={styles.text}>
                        These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Controlling Cookies</h2>
                    <p className={styles.text}>
                        Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className={styles.link}>www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className={styles.link}>www.allaboutcookies.org</a>.
                    </p>
                    <p className={styles.text}>
                        Find out how to manage cookies on popular browsers:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className={styles.link}>Google Chrome</a></li>
                        <li className={styles.listItem}><a href="https://support.apple.com/kb/ph21411" target="_blank" rel="noopener noreferrer" className={styles.link}>Safari</a></li>
                        <li className={styles.listItem}><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className={styles.link}>Firefox</a></li>
                        <li className={styles.listItem}><a href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className={styles.link}>Microsoft Edge</a></li>
                    </ul>
                </section>

                <div className={styles.contactBox}>
                    <h2 className={styles.sectionTitle}>5. More Information</h2>
                    <p className={styles.text}>
                        Hopefully that has clarified things for you. If there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
                    </p>
                    <p className={styles.text}>
                        For further information, please contact us:
                    </p>
                    <p className={styles.text}>
                        Email: <a href="mailto:privacy@thegolfpress.com" className={styles.link}>privacy@thegolfpress.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
