import { fetchNews } from '@/lib/api';
import CoursesClient from './CoursesClient';

export default async function CoursesPage() {
    let courses: any[] = [];

    try {
        const { data } = await fetchNews('COURSES');
        courses = data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }

    return <CoursesClient initialCourses={courses} />;
}
