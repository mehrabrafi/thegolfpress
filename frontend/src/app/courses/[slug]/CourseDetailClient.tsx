'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import { MapPinOff } from 'lucide-react';
import JsonLd, { createGolfCourseJsonLd } from '@/components/JsonLd';
import { API_BASE_URL } from '@/lib/api';
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
    author?: string;
    time?: string;
    createdAt?: string;
}

interface CourseDetailClientProps {
    viewMode: 'detail' | 'category' | 'error';
    course: Course | null;
    initialCourses: Course[];
    serverTotal: number;
    pageSize: number;
    slug: string;
    tagFilter: string;
}

// ── Client-side paginated fetch ─────────────────────────────────
async function clientFetchCourses(params: {
    skip: number;
    take: number;
    tag: string;
}): Promise<{ data: any[]; total: number }> {
    const query = new URLSearchParams();
    query.append('category', 'COURSES');
    if (params.tag) query.append('tag', params.tag);
    query.append('skip', String(params.skip));
    query.append('take', String(params.take));

    const res = await fetch(`${API_BASE_URL}/news?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch courses');

    const json = await res.json();

    if (Array.isArray(json)) {
        return { data: json, total: json.length };
    }
    return {
        data: Array.isArray(json.data) ? json.data : [],
        total: typeof json.total === 'number' ? json.total : (json.data?.length ?? 0),
    };
}

export default function CourseDetailClient({
    viewMode,
    course,
    initialCourses,
    serverTotal,
    pageSize,
    slug,
    tagFilter,
}: CourseDetailClientProps) {
    if (viewMode === 'detail' && course) {
        return <CourseDetailContent course={course} />;
    }

    if (viewMode === 'category') {
        return (
            <CourseCategoryContent
                initialCourses={initialCourses}
                serverTotal={serverTotal}
                pageSize={pageSize}
                slug={slug}
                tagFilter={tagFilter}
            />
        );
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
                            <Image src={course.image} alt={course.title} fill className={detailStyles.heroImage} priority sizes="(max-width: 1100px) 100vw, 900px" style={{ objectFit: 'cover' }} />
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
                                <h2 className={detailStyles.sectionTitle}>Course Map</h2>
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


// ── Course Category Component (with Load More) ──────────────────
function CourseCategoryContent({
    initialCourses,
    serverTotal,
    pageSize,
    slug,
    tagFilter,
}: {
    initialCourses: Course[];
    serverTotal: number;
    pageSize: number;
    slug: string;
    tagFilter: string;
}) {
    const title = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'COURSES';
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [total, setTotal] = useState<number>(serverTotal);
    const [loadingMore, setLoadingMore] = useState(false);

    const hasMore = courses.length < total && courses.length > 0;

    const handleLoadMore = useCallback(async () => {
        setLoadingMore(true);
        try {
            const { data, total: t } = await clientFetchCourses({
                skip: courses.length,
                take: pageSize,
                tag: tagFilter,
            });
            setCourses(prev => [...prev, ...data]);
            setTotal(t);
        } catch (err) {
            console.error('Load more courses failed:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [courses.length, pageSize, tagFilter]);

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
                        <>
                            <div className={styles.cardsGrid}>
                                {courses.map((item) => (
                                    <CourseCard key={item.id} item={item} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className={styles.loadMore}>
                                    <button
                                        className={styles.loadMoreBtn}
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? (
                                            'Loading...'
                                        ) : (
                                            <>
                                                Load More Courses{' '}
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="m6 9 6 6 6-6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                    <span className={styles.articleCount}>
                                        Showing {courses.length} of {total} courses
                                    </span>
                                </div>
                            )}
                        </>
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
            <Image src={item.image} alt={item.title} fill className={styles.cardImage} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardExcerpt}>{item.excerpt}</p>
            <div className={styles.cardMeta}>
                BY {item.author?.toUpperCase() || 'THE GOLF PRESS'} • PUBLISHED {item.time?.toUpperCase() || (item.createdAt ? new Date(item.createdAt).toLocaleDateString().toUpperCase() : '')}
            </div>
        </div>
    </Link>
);
