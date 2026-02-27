const IS_SERVER = typeof window === 'undefined';
// In production, NEXT_PUBLIC_API_URL will be set to the real backend URL (https://api.thegolfpress.com).
// In dev, it might be undefined, so we fall back to localhost:5001 (server) or /api (client proxy).
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (IS_SERVER ? 'http://localhost:5001' : '/api');
export const API_BASE_URL = `${BASE_URL}/golf`;
export const AUTH_BASE_URL = `${BASE_URL}/auth`;
export const PLAYER_BASE_URL = `${BASE_URL}/player`;
export const UPLOAD_URL = `${BASE_URL}/upload`;

// ── Public Data Endpoints ───────────────────────────────────────

export async function fetchLeaderboard() {
    const res = await fetch(`${API_BASE_URL}/leaderboard`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
}

export async function fetchScoreboard() {
    const res = await fetch(`${API_BASE_URL}/scoreboard`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch scoreboard');
    return res.json();
}

export async function fetchUpcoming() {
    const res = await fetch(`${API_BASE_URL}/upcoming`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch upcoming events');
    return res.json();
}

export async function fetchSchedule() {
    const res = await fetch(`${API_BASE_URL}/schedule`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch schedule');
    return res.json();
}

export async function fetchRankings() {
    const res = await fetch(`${API_BASE_URL}/rankings`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch rankings');
    return res.json();
}

export async function fetchPlayerProfile(id: string) {
    const url = `${API_BASE_URL}/players/${id}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch player profile');
    return res.json();
}

export async function fetchNews(category?: string, tag?: string, status?: string, skip?: number, take?: number, excludeCategories?: string[]): Promise<{ data: any[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (tag) queryParams.append('tag', tag);
    if (status) queryParams.append('status', status);
    if (skip !== undefined) queryParams.append('skip', String(skip));
    if (take !== undefined) queryParams.append('take', String(take));
    if (excludeCategories && excludeCategories.length > 0) queryParams.append('excludeCategories', excludeCategories.join(','));

    const queryString = queryParams.toString();
    const finalUrl = `${API_BASE_URL}/news${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(finalUrl, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch news');

    const json = await res.json();

    // Normalize: backend পুরনো (array) বা নতুন ({ data, total }) যেকোনো format পাঠাতে পারে
    if (Array.isArray(json)) {
        return { data: json, total: json.length };
    }
    return {
        data: Array.isArray(json.data) ? json.data : [],
        total: typeof json.total === 'number' ? json.total : (json.data?.length ?? 0),
    };
}

export async function fetchNewsById(id: string) {
    const url = `${API_BASE_URL}/news/${id}`;
    try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) {
            throw new Error('Failed to fetch news detail');
        }
        return res.json();
    } catch (error) {
        throw error;
    }
}

export async function fetchTrendingNews() {
    const res = await fetch(`${API_BASE_URL}/news/trending`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch trending news');
    return res.json();
}

export async function fetchSearch(query: string) {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search');
    return res.json();
}

export async function fetchMaintenanceStatus() {
    const res = await fetch(`${API_BASE_URL}/maintenance-status`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch maintenance status');
    return res.json();
}

export async function trackActivity(visitorId: string, userId?: string) {
    try {
        await fetch(`${API_BASE_URL}/track-activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitorId, userId }),
        });
    } catch (e) {
        // Silently fail for tracking
    }
}

// ── Auth Endpoints (cookie-based, no token in response) ─────────

export async function login(credentials: any) {
    const res = await fetch(`${AUTH_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }
    return res.json();
}

export async function register(userData: any) {
    const res = await fetch(`${AUTH_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
    }
    return res.json();
}

export async function getProfile() {
    const res = await fetch(`${AUTH_BASE_URL}/profile`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

export async function completeOnboarding(preferredCategories: string[], playerIds: string[]) {
    const res = await fetch(`${AUTH_BASE_URL}/onboarding`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredCategories, playerIds }),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to complete onboarding');
    return res.json();
}

export async function logout() {
    const res = await fetch(`${AUTH_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
}

export async function updateUserProfile(data: { name?: string; image?: string }) {
    const res = await fetch(`${AUTH_BASE_URL}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
}

export async function deleteUserAccount() {
    const res = await fetch(`${AUTH_BASE_URL}/delete-account`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete account');
    return res.json();
}

export async function uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${UPLOAD_URL}/profile`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (!res.ok) {
        let errorMsg = `Upload failed (${res.status})`;
        try {
            const errorBody = await res.json();
            errorMsg = errorBody.message || errorMsg;
        } catch { }
        throw new Error(errorMsg);
    }
    return res.json();
}

// ── Protected CRUD Endpoints (cookie-based auth) ────────────────

export async function createNews(data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) {
        let errorMsg = 'Failed to create news';
        try {
            const errorBody = await res.json();
            if (errorBody.message) {
                errorMsg = Array.isArray(errorBody.message)
                    ? `Validation Error: ${errorBody.message.join(', ')}`
                    : errorBody.message;
            }
        } catch (e) { }
        throw new Error(errorMsg);
    }
    return res.json();
}

export async function updateNews(id: string, data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) {
        let errorMsg = 'Failed to update news';
        try {
            const errorBody = await res.json();
            if (errorBody.message) {
                errorMsg = Array.isArray(errorBody.message)
                    ? `Validation Error: ${errorBody.message.join(', ')}`
                    : errorBody.message;
            }
        } catch (e) { }
        throw new Error(errorMsg);
    }
    return res.json();
}

export async function deleteNews(id: string, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete news');
    return res.json();
}

export async function uploadImage(file: File, _token?: string) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (!res.ok) {
        let errorMsg = `Upload failed (${res.status})`;
        try {
            const errorBody = await res.json();
            errorMsg = errorBody.message || errorMsg;
        } catch {
            // response might not be JSON
        }
        throw new Error(errorMsg);
    }
    return res.json();
}

// ── Admin Endpoints (cookie-based auth) ─────────────────────────

export async function fetchAdminStats(_token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
}

export async function fetchSystemHealth(_token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/health`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
}

export async function fetchContentAnalytics(_token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
}

export async function fetchUsers(_token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

export async function updateUserRole(id: string, role: string, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
}

export async function fetchSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
}

export async function updateSetting(key: string, value: string, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return res.json();
}

export async function formatDatabase() {
    const res = await fetch(`${API_BASE_URL}/admin/format-database`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to format database');
    return res.json();
}

// ── Category Endpoints ──────────────────────────────────────────

export async function fetchCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

export async function createCategory(data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
}

export async function updateCategory(id: string, data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
}

export async function deleteCategory(id: string, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
}

// ── Sub-Tag Endpoints ───────────────────────────────────────────

export async function fetchSubTags(categoryId?: string) {
    const queryParams = new URLSearchParams();
    if (categoryId) queryParams.append('categoryId', categoryId);

    const queryString = queryParams.toString();
    const finalUrl = `${API_BASE_URL}/sub-tags${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(finalUrl);
    if (!res.ok) throw new Error('Failed to fetch sub-tags');
    return res.json();
}

export async function createSubTag(data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/sub-tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create sub-tag');
    return res.json();
}

export async function updateSubTag(id: string, data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/sub-tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update sub-tag');
    return res.json();
}

export async function deleteSubTag(id: string, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/sub-tags/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete sub-tag');
    return res.json();
}

// ── Home Section Endpoints ──────────────────────────────────────




// ── Player Follow Endpoints ──────────────────────────────────────

export async function fetchAllPlayers() {
    const res = await fetch(`${PLAYER_BASE_URL}`);
    if (!res.ok) throw new Error('Failed to fetch players');
    return res.json();
}

export async function fetchMyPlayers() {
    const res = await fetch(`${PLAYER_BASE_URL}/my-list`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch user players');
    return res.json();
}

export async function fetchMyFeed() {
    const res = await fetch(`${PLAYER_BASE_URL}/my-feed`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch feed');
    return res.json();
}

export async function followPlayer(id: string) {
    const res = await fetch(`${PLAYER_BASE_URL}/follow/${id}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to follow player');
    return res.json();
}

export async function unfollowPlayer(id: string) {
    const res = await fetch(`${PLAYER_BASE_URL}/follow/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to unfollow player');
    return res.json();
}

// ── Admin Player Management Endpoints ────────────────────────────

export async function adminCreatePlayer(data: { name: string; slug: string; image?: string }) {
    const res = await fetch(`${PLAYER_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create player');
    return res.json();
}

export async function adminUpdatePlayer(id: string, data: { name?: string; slug?: string; image?: string }) {
    const res = await fetch(`${PLAYER_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update player');
    return res.json();
}

export async function adminDeletePlayer(id: string) {
    const res = await fetch(`${PLAYER_BASE_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete player');
    return res.json();
}
