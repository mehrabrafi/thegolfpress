export const API_BASE_URL = 'http://localhost:5001/golf';

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
    console.log('Fetching player profile from URL:', url);
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch player profile');
    return res.json();
}

export async function fetchNews(category?: string) {
    const url = new URL(`${API_BASE_URL}/news`);
    if (category) url.searchParams.append('category', category);

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
}

export async function fetchNewsById(id: string) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch news detail');
    return res.json();
}

export async function fetchTrendingNews() {
    const res = await fetch(`${API_BASE_URL}/news/trending`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch trending news');
    return res.json();
}

export const AUTH_BASE_URL = 'http://localhost:5001/auth';

export async function login(credentials: any) {
    const res = await fetch(`${AUTH_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
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
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
    }
    return res.json();
}

export async function getProfile(token: string) {
    const res = await fetch(`${AUTH_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

export async function createNews(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create news');
    return res.json();
}

export async function updateNews(id: string, data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update news');
    return res.json();
}

export async function deleteNews(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    if (!res.ok) throw new Error('Failed to delete news');
    return res.json();
}

export const UPLOAD_URL = 'http://127.0.0.1:5001/upload';

export async function uploadImage(file: File, token: string) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload image');
    return res.json();
}
