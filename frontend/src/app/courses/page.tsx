import { fetchNews } from '@/lib/api';
import CoursesClient from './CoursesClient';

export default async function CoursesPage() {
    let courses: any[] = [];

    try {
        courses = await fetchNews('COURSES');
    } catch (error) {
        console.error('Error fetching courses:', error);
    }

    return <CoursesClient initialCourses={courses} />;
}
