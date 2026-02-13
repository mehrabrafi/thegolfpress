import { fetchNewsById, fetchNews } from '@/lib/api';
import CourseDetailClient from './CourseDetailClient';
import type { Metadata } from 'next';

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
                        courses={[]}
                        slug={slug}
                    />
                );
            }
        } catch {
            // Not a valid course ID, proceed to check category
        }

        // 2. If not a specific course, try to fetch as a category (e.g. /courses/scotland)
        const categoryData = await fetchNews('COURSES', slug);
        return (
            <CourseDetailClient
                viewMode="category"
                course={null}
                courses={categoryData || []}
                slug={slug}
            />
        );

    } catch (error) {
        console.error('Error fetching course data:', error);
        return (
            <CourseDetailClient
                viewMode="error"
                course={null}
                courses={[]}
                slug={slug}
            />
        );
    }
}
