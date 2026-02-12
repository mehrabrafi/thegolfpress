'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: any;
    login: (credentials: any) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            try {
                const token = localStorage.getItem('token');
                const profile = await getProfile(token || undefined);
                setUser(profile);
            } catch (err) {
                // If profile fails, user is likely not logged in or cookie expired
                setUser(null);
                localStorage.removeItem('token');
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    const login = async (credentials: any) => {
        const data = await apiLogin(credentials);
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }
        setUser(data.user);
        if (data.user.role === 'ADMIN') {
            router.push('/admin/dashboard');
        } else {
            router.push('/');
        }
    };

    const signup = async (userData: any) => {
        const data = await apiRegister(userData);
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }
        setUser(data.user);
        if (data.user.role === 'ADMIN') {
            router.push('/admin/dashboard');
        } else {
            router.push('/');
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (err) {
            console.error('Logout failed', err);
        }
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
