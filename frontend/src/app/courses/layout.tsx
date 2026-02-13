import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Golf Courses',
    description: 'Explore expert reviews from over 17,000 golf courses worldwide. Search by location or course name to find and plan your next round.',
    openGraph: {
        title: 'Golf Course Reviews | The Golf Press',
        description: 'Comprehensive reviews of the world\'s top golf courses. Search by location, explore ratings, and plan your next round.',
    },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
