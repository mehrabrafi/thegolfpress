'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackActivity } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

export default function ActivityTracker() {
    const { user } = useAuth();

    useEffect(() => {
        const VISITOR_ID_KEY = 'tgp_visitor_id';
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);

        if (!visitorId) {
            visitorId = uuidv4();
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        // Track activity
        trackActivity(visitorId, user?.id);
    }, [user?.id]);

    return null;
}
