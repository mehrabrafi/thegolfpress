'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (credentials: any) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            try {
                // Auth is now fully cookie-based — no token needed
                const profile = await getProfile();
                setUser(profile);
            } catch (err) {
                // If profile fails, user is likely not logged in or cookie expired
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    const login = async (credentials: any) => {
        const data = await apiLogin(credentials);
        // Token is now set as httpOnly cookie by the server — no need to store it
        setUser(data.user);
        if (data.user.role === 'ADMIN') {
            router.push('/admin/dashboard');
        } else {
            router.push('/');
        }
    };

    const signup = async (userData: any) => {
        const data = await apiRegister(userData);
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
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
