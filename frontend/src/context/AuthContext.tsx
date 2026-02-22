'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import wizard to avoid SSR issues with player fetch
const OnboardingWizard = dynamic(() => import('@/components/OnboardingWizard'), { ssr: false });

interface AuthContextType {
    user: any;
    setUser: (user: any) => void;
    login: (credentials: any) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
    openOnboarding: (mode?: 'onboarding' | 'tune') => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    login: async () => { },
    signup: async () => { },
    logout: () => { },
    openOnboarding: () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingMode, setOnboardingMode] = useState<'onboarding' | 'tune'>('onboarding');
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
            router.push('/tgpadmin');
        } else {
            router.push('/');
        }
    };

    const signup = async (userData: any) => {
        const data = await apiRegister(userData);
        localStorage.setItem('tgp_auth_hint', 'true');
        setUser(data.user);

        // Show onboarding wizard for new users (role is always USER on new signup)
        if (data.user.role !== 'ADMIN') {
            setShowOnboarding(true);
            // Don't navigate yet — wizard will handle it
        } else {
            router.push('/tgpadmin');
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch {
            // Logout API call failed — clear local state anyway
        }
        setUser(null);
        setShowOnboarding(false);
        localStorage.removeItem('tgp_auth_hint');
        router.push('/login');
    };

    const openOnboarding = (mode: 'onboarding' | 'tune' = 'onboarding') => {
        setOnboardingMode(mode);
        setShowOnboarding(true);
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        // Refresh profile to get updated preferences
        getProfile().then(profile => setUser(profile)).catch(() => { });
        router.push('/my-feed');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout, openOnboarding, loading }}>
            {children}
            {showOnboarding && (
                <OnboardingWizard mode={onboardingMode} onComplete={handleOnboardingComplete} />
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
