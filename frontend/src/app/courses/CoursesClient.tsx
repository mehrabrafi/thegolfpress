'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './courses.module.css';

interface Course {
    id: string;
    title: string;
    image: string;
    content?: string;
    excerpt?: string;
    category: string;
    categoryTag?: string;
    createdAt?: string;
}

interface CoursesClientProps {
    initialCourses: Course[];
}

export default function CoursesClient({ initialCourses }: CoursesClientProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter by search term if active
    const filteredCourses = searchTerm
        ? initialCourses.filter((c: Course) =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.categoryTag && c.categoryTag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : initialCourses;

    // Group courses by location (categoryTag)
    const groupedCourses = filteredCourses.reduce((acc, course) => {
        const tag = course.categoryTag ? course.categoryTag.trim().toUpperCase() : 'OTHER LOCATIONS';
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(course);
        return acc;
    }, {} as Record<string, Course[]>);

    // Get sorted list of tags
    const sortedTags = Object.keys(groupedCourses).sort((a, b) => a.localeCompare(b));

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
                            placeholder="Search by location or course name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <div className={styles.contentSections}>
                {searchTerm ? (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionLeft}>
                                <div className={styles.redBar}></div>
                                <h2 className={styles.sectionTitle}>SEARCH RESULTS</h2>
                            </div>
                        </div>
                        {filteredCourses.length > 0 ? (
                            <div className={styles.cardsGrid}>
                                {filteredCourses.map((item) => (
                                    <CourseCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                No courses found for &quot;{searchTerm}&quot;
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* Dynamic Sections Based on Available Tags */}
                        {sortedTags.map((tag) => (
                            <section key={tag} className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <div className={styles.sectionLeft}>
                                        <div className={styles.redBar}></div>
                                        <Link href={`/courses/${tag.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h2 className={styles.sectionTitle} style={{ cursor: 'pointer' }}>COURSES IN {tag}</h2>
                                        </Link>
                                    </div>
                                    <Link href={`/courses/${tag.toLowerCase()}`} className={styles.viewAllLink}>
                                        View All
                                    </Link>
                                </div>

                                {/* Horizontal Slider for courses in this tag */}
                                <div className={styles.sliderContainer}>
                                    {groupedCourses[tag].map((item: Course) => (
                                        <CourseCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </section>
                        ))}

                        {initialCourses.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <p>No courses available right now.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const CourseCard = ({ item }: { item: Course }) => (
    <Link href={`/courses/${item.id}`} className={styles.categoryCard}>
        <div className={styles.cardImageWrapper}>
            <Image src={item.image} alt={item.title} fill className={styles.cardImage} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.cardContent}>
            <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                color: "#ed3e49",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "4px",
                display: "block"
            }}>
                {item.categoryTag || 'COURSE'}
            </span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
        </div>
    </Link>
);
