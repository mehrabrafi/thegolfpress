import { fetchNewsById, fetchNews } from '@/lib/api';
import CourseDetailClient from './CourseDetailClient';
import type { Metadata } from 'next';

const PAGE_SIZE = 10;

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const { slug } = await params;

    try {
        // Try to fetch as a specific course
        const course = await fetchNewsById(slug);
        if (course && course.id) {
            return {
                title: `${course.title} | Course Review`,
                description: course.excerpt || `Discover ${course.title}, one of the top-rated golf courses. Read our comprehensive review with detailed analysis.`,
                openGraph: {
                    title: `${course.title} — Golf Course Review`,
                    description: course.excerpt || `Comprehensive review of ${course.title}.`,
                    images: course.image ? [{ url: course.image, width: 1200, height: 630, alt: course.title }] : [],
                },
            };
        }
    } catch {
        // Not a course ID — might be a category
    }

    // Fallback: treat as category
    const title = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Courses';
    return {
        title: `Golf Courses in ${title}`,
        description: `Explore top-rated golf courses in ${title}. Read expert reviews, view course maps, and plan your next round.`,
    };
}

export default async function CourseDetailPage({ params }: { params: any }) {
    const { slug } = await params;

    try {
        // 1. Try to fetch as a specific course by ID
        try {
            const courseData = await fetchNewsById(slug);
            if (courseData && courseData.id) {
                return (
                    <CourseDetailClient
                        viewMode="detail"
                        course={courseData}
                        initialCourses={[]}
                        serverTotal={0}
                        pageSize={PAGE_SIZE}
                        slug={slug}
                        tagFilter=""
                    />
                );
            }
        } catch {
            // Not a valid course ID, proceed to check category
        }

        // 2. If not a specific course, fetch as a category (e.g. /courses/scotland or /courses/united-states)
        // Convert hyphenated slug back to tag name (e.g. "united-states" -> "united states")
        const tagName = slug.replace(/-/g, ' ');
        const { data, total } = await fetchNews('COURSES', tagName, undefined, 0, PAGE_SIZE);

        return (
            <CourseDetailClient
                viewMode="category"
                course={null}
                initialCourses={data || []}
                serverTotal={total || 0}
                pageSize={PAGE_SIZE}
                slug={slug}
                tagFilter={tagName}
            />
        );

    } catch (error) {
        console.error('Error fetching course data:', error);
        return (
            <CourseDetailClient
                viewMode="error"
                course={null}
                initialCourses={[]}
                serverTotal={0}
                pageSize={PAGE_SIZE}
                slug={slug}
                tagFilter=""
            />
        );
    }
}
