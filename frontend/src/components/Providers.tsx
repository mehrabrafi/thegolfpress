'use client';

import { AuthProvider } from '@/context/AuthContext';
import ActivityTracker from './ActivityTracker';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ActivityTracker />
            {children}
        </AuthProvider>
    );
}
