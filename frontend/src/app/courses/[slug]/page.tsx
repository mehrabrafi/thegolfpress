'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchNewsById, fetchNews } from '@/lib/api';
import Link from 'next/link';
import styles from '../courses.module.css';
import detailStyles from './course-detail.module.css';

export default function Page() {
    const params = useParams();
    const slug = params?.slug as string;
    const [viewMode, setViewMode] = useState<'loading' | 'detail' | 'category' | 'error'>('loading');
    const [course, setCourse] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        if (!slug) return;

        const loadData = async () => {
            try {
                // 1. Try to fetch as a specific course (by ID)
                // If the slug is a UUID-like string, it's likely a course ID
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
                if (isUuid) {
                    try {
                        const courseData = await fetchNewsById(slug);
                        if (courseData && courseData.id) {
                            setCourse(courseData);
                            setViewMode('detail');
                            return;
                        }
                    } catch (e) {
                        // Not a valid course ID or not found, proceed to check category
                    }
                }

                // 2. If not a specific course, try to fetch as a category (e.g. /courses/usa)
                const categoryData = await fetchNews('COURSES', slug);
                if (categoryData && categoryData.length > 0) {
                    setCourses(categoryData);
                    setViewMode('category');
                } else {
                    // Also check if it's an emptiness case vs not found
                    setCourses([]); // empty array valid for empty category
                    setViewMode('category');
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setViewMode('error');
            }
        };

        loadData();
    }, [slug]);

    if (viewMode === 'loading') return <div className={styles.loading}>Loading...</div>;

    if (viewMode === 'detail' && course) {
        return <CourseDetailContent course={course} />;
    }

    if (viewMode === 'category') {
        return <CourseCategoryContent courses={courses} slug={slug} />;
    }

    return <div className={styles.loading}>Not found</div>;
}


import { MapPinOff } from 'lucide-react';

// --- Course Detail Component (Moved from [id]/page.tsx) ---
function CourseDetailContent({ course }: { course: any }) {

    // Improved map query: Title + Tag (Location) + " Golf Course"
    const locationInfo = course.categoryTag || '';
    const mapQuery = encodeURIComponent(`${course.title} ${locationInfo} Golf Course`);

    // Basic logic to determine if we should even try to show a map
    // (If title is very short or generic, it might fail)
    const hasSufficientLocation = course.title && course.title.length > 3;

    return (
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
                        {course.content && course.content.trim().startsWith('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: course.content }} />
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
    );
}


// --- Course Category Component (Original [slug]/page.tsx logic) ---
function CourseCategoryContent({ courses, slug }: { courses: any[], slug: string }) {
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

const CourseCard = ({ item }: { item: any }) => (
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
