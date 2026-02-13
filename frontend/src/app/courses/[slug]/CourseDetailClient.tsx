'use client';

import Link from 'next/link';
import DOMPurify from 'dompurify';
import { MapPinOff } from 'lucide-react';
import JsonLd, { createGolfCourseJsonLd } from '@/components/JsonLd';
import styles from '../courses.module.css';
import detailStyles from './course-detail.module.css';

// ── Shared Types ────────────────────────────────────────────────
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

interface CourseDetailClientProps {
    viewMode: 'detail' | 'category' | 'error';
    course: Course | null;
    courses: Course[];
    slug: string;
}

export default function CourseDetailClient({ viewMode, course, courses, slug }: CourseDetailClientProps) {
    if (viewMode === 'detail' && course) {
        return <CourseDetailContent course={course} />;
    }

    if (viewMode === 'category') {
        return <CourseCategoryContent courses={courses} slug={slug} />;
    }

    return (
        <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#666' }}>
                <h2 style={{ marginBottom: '12px', color: '#1a202c' }}>Course Not Found</h2>
                <p>The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link href="/courses" style={{ color: 'var(--primary-red)', fontWeight: 700, marginTop: '20px', display: 'inline-block' }}>
                    ← Back to All Courses
                </Link>
            </div>
        </div>
    );
}


// ── Course Detail Component ─────────────────────────────────────
function CourseDetailContent({ course }: { course: Course }) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';
    const locationInfo = course.categoryTag || '';
    const mapQuery = encodeURIComponent(`${course.title} ${locationInfo} Golf Course`);
    const hasSufficientLocation = course.title && course.title.length > 3;

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = course.content && course.content.trim().startsWith('<')
        ? DOMPurify.sanitize(course.content, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'span', 'div'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel'],
        })
        : null;

    return (
        <>
            <JsonLd data={createGolfCourseJsonLd({
                name: course.title,
                description: course.excerpt || `Discover ${course.title}, one of the top-rated golf courses.`,
                image: course.image,
                url: `${SITE_URL}/courses/${course.id}`,
            })} />

            <div className={detailStyles.pageContainer}>
                <div className={detailStyles.topLayout}>
                    {/* Left Column: Main Content */}
                    <main className={detailStyles.mainContent}>
                        <span className={detailStyles.categoryLabel}>{course.categoryTag || 'Course'}</span>
                        <h1 className={detailStyles.title}>{course.title}</h1>

                        <div className={detailStyles.heroImageContainer}>
                            <img src={course.image} alt={course.title} className={detailStyles.heroImage} />
                        </div>
                        <p className={detailStyles.imageCaption}>{course.title}</p>

                        <div className={detailStyles.articleBody}>
                            {sanitizedContent ? (
                                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                            ) : (
                                course.content && course.content.split('\n').map((para: string, idx: number) => (
                                    <p key={idx}>{para}</p>
                                ))
                            )}
                        </div>
                    </main>

                    {/* Right Column: Sidebar */}
                    <aside className={detailStyles.sidebar}>
                        <div className={detailStyles.sidebarSection}>
                            <div className={detailStyles.sectionHeader}>
                                <div className={detailStyles.greenBar}></div>
                                <h3 className={detailStyles.sectionTitle}>Course Map</h3>
                            </div>

                            {hasSufficientLocation ? (
                                <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                    <iframe
                                        width="100%"
                                        height="400"
                                        frameBorder="0"
                                        style={{ border: 0, display: 'block' }}
                                        src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                        allowFullScreen
                                        loading="lazy"
                                        title={`Map of ${course.title}`}
                                    ></iframe>
                                </div>
                            ) : (
                                <div className={detailStyles.mapPlaceholder}>
                                    <div className={detailStyles.mapPlaceholderIcon}>
                                        <MapPinOff size={48} />
                                    </div>
                                    <div className={detailStyles.mapPlaceholderText}>
                                        Location details currently unavailable in our database.
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}


// ── Course Category Component ───────────────────────────────────
function CourseCategoryContent({ courses, slug }: { courses: Course[], slug: string }) {
    const title = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'COURSES';

    return (
        <div className={styles.container}>
            <section className={styles.hero} style={{ minHeight: '40vh' }}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>COURSES IN {title}</h1>
                    <p className={styles.heroSubtitle}>DISCOVER TOP RATED COURSES</p>
                    <Link href="/courses" className={styles.backLink}>
                        ← BACK TO ALL COURSES
                    </Link>
                </div>
            </section>

            <div className={styles.contentSections}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionLeft}>
                            <div className={styles.redBar}></div>
                            <h2 className={styles.sectionTitle}>{title} COURSES</h2>
                        </div>
                    </div>

                    {courses.length > 0 ? (
                        <div className={styles.cardsGrid}>
                            {courses.map((item) => (
                                <CourseCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                            <p>No courses found in {title}.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

const CourseCard = ({ item }: { item: Course }) => (
    <Link href={`/courses/${item.id}`} className={styles.categoryCard}>
        <div className={styles.cardImageWrapper}>
            <img src={item.image} alt={item.title} className={styles.cardImage} />
        </div>
        <div className={styles.cardContent}>
            <span className={detailStyles.categoryLabel} style={{ marginBottom: '8px', display: 'inline-block', fontSize: '10px' }}>
                {item.categoryTag || 'COURSE'}
            </span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
        </div>
    </Link>
);
