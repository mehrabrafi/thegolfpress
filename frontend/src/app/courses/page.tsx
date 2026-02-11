'use client';

import { useEffect, useState } from 'react';
import styles from './courses.module.css';
import { fetchNews } from '@/lib/api';
import Link from 'next/link';

const COUNTRIES = ['Scotland', 'England', 'Portugal', 'Spain', 'United Kingdom'];
const STATES = ['Florida', 'California', 'New York', 'Texas'];

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchNews('COURSES');
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const byCountry = courses.filter(c => COUNTRIES.includes(c.categoryTag));
    const byState = courses.filter(c => STATES.includes(c.categoryTag));

    if (loading) return <div className={styles.loading}>Loading courses...</div>;

    return (
        <div className={styles.container}>
            {/* Search Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>START YOUR SEARCH HERE</h1>
                    <p className={styles.heroSubtitle}>EXPLORE REVIEWS FOR OVER 17,000 COURSES</p>
                    <div className={styles.searchBox}>
                        <div className={styles.searchIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </div>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search by location or course"
                        />
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <div className={styles.contentSections}>
                {/* Search By Country */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.redBar}></div>
                        <h2 className={styles.sectionTitle}>SEARCH BY COUNTRY</h2>
                    </div>
                    <div className={styles.sliderContainer}>
                        {byCountry.map((item) => (
                            <Link href={`/news/${item.id}`} key={item.id} className={styles.categoryCard}>
                                <div className={styles.cardImageWrapper}>
                                    <img src={item.image} alt={item.title} className={styles.cardImage} />
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardBrand}>
                                        TGP<span className={styles.brandPlus}>+</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Search By State */}
                <section className={styles.section} style={{ backgroundColor: '#f9f9f9' }}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.redBar}></div>
                        <h2 className={styles.sectionTitle}>SEARCH BY STATE</h2>
                    </div>
                    <div className={styles.sliderContainer}>
                        {byState.map((item) => (
                            <Link href={`/news/${item.id}`} key={item.id} className={styles.categoryCard}>
                                <div className={styles.cardImageWrapper}>
                                    <img src={item.image} alt={item.title} className={styles.cardImage} />
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardBrand}>
                                        TGP<span className={styles.brandPlus}>+</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
