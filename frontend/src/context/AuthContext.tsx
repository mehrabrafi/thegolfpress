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
            // Check for a login hint to avoid unnecessary 401s in logs/Lighthouse
            const authHint = localStorage.getItem('tgp_auth_hint');

            if (!authHint) {
                setLoading(false);
                return;
            }

            try {
                const profile = await getProfile();
                setUser(profile);
                // Ensure hint is set if we got a profile
                localStorage.setItem('tgp_auth_hint', 'true');
            } catch {
                setUser(null);
                // Clear hint if profile fetch fails
                localStorage.removeItem('tgp_auth_hint');
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    const login = async (credentials: any) => {
        const data = await apiLogin(credentials);
        localStorage.setItem('tgp_auth_hint', 'true');
        setUser(data.user);
        if (data.user.role === 'ADMIN') {
            router.push('/tgpadmin/dashboard');
        } else {
            router.push('/');
        }
    };

    const signup = async (userData: any) => {
        const data = await apiRegister(userData);
        localStorage.setItem('tgp_auth_hint', 'true');
        setUser(data.user);
        if (data.user.role === 'ADMIN') {
            router.push('/tgpadmin/dashboard');
        } else {
            router.push('/');
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch {
            // Logout API call failed — clear local state anyway
        }
        setUser(null);
        localStorage.removeItem('tgp_auth_hint');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
