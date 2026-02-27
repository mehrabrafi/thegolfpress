'use client';

import NewsManagement from '@/components/admin/NewsManagement';

export default function AdminNewsPage() {
    return (
        <NewsManagement
            title="General News Management"
            excludeCategories={['GUIDES-TIPS', 'COURSES', 'EQUIPMENT', 'LIFESTYLE']}
        />
    );
}
