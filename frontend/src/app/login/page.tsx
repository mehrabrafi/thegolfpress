'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Image Section */}
            <div className={styles.imageSection}>
                {/* Optional: Overlay or other content on image */}
            </div>

            {/* Right Form Section */}
            <div className={styles.formSection}>
                <div className={styles.formContent}>
                    {/* Brand Logo */}
                    <Link href="/" className={styles.logoLink}>
                        <img src="/logo.png" alt="The Golf Press" className={styles.authLogo} />
                    </Link>

                    <h1 className={styles.title}>SIGN IN</h1>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.group}>
                            <label>EMAIL</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.group}>
                            <label>PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className={styles.input}
                            />
                            <Link href="/forgot-password" className={styles.forgotPassword}>
                                Forgot your password?
                            </Link>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            SIGN IN
                        </button>
                    </form>

                    <div className={styles.footer}>
                        Don't have an account?
                        <Link href="/signup" className={styles.footerLink}>SIGN UP</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
