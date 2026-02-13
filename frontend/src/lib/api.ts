const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const API_BASE_URL = `${BASE_URL}/golf`;
export const AUTH_BASE_URL = `${BASE_URL}/auth`;
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

export async function fetchNews(category?: string, tag?: string) {
    const url = new URL(`${API_BASE_URL}/news`);
    if (category) url.searchParams.append('category', category);
    if (tag) url.searchParams.append('tag', tag);

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
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

export async function logout() {
    const res = await fetch(`${AUTH_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
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
    if (!res.ok) throw new Error('Failed to create news');
    return res.json();
}

export async function updateNews(id: string, data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update news');
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
    const url = new URL(`${API_BASE_URL}/sub-tags`);
    if (categoryId) url.searchParams.append('categoryId', categoryId);

    const res = await fetch(url.toString());
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

export async function fetchHomeSections() {
    const res = await fetch(`${API_BASE_URL}/home-sections`);
    if (!res.ok) throw new Error('Failed to fetch home sections');
    return res.json();
}

export async function fetchAllHomeSections(_token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/home-sections`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch all home sections');
    return res.json();
}

export async function createHomeSection(data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/home-sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create home section');
    return res.json();
}

export async function updateHomeSection(id: string, data: any, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/home-sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update home section');
    return res.json();
}

export async function deleteHomeSection(id: string, _token?: string) {
    const res = await fetch(`${API_BASE_URL}/admin/home-sections/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete home section');
    return res.json();
}
