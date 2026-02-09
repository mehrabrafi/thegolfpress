'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './signup.module.css';
import Link from 'next/link';

export default function SignupPage() {
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signup({ name, email, password });
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Image Section */}
            <div className={styles.imageSection}>
                {/* Optional: Overlay */}
            </div>

            {/* Right Form Section */}
            <div className={styles.formSection}>
                <div className={styles.formContent}>
                    {/* Brand Logo */}
                    <Link href="/" className={styles.logo}>
                        T<span className={styles.dot}>.</span>G<span className={styles.dot}>.</span>P
                    </Link>

                    <h1 className={styles.title}>CREATE AN ACCOUNT</h1>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.group}>
                            <label>FULL NAME</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>

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
                        </div>

                        {/* Legal Text */}
                        <div style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.4', marginTop: '10px' }}>
                            By creating an account, you agree to our <a href="#" style={{ textDecoration: 'underline' }}>Visitor Agreement</a> and acknowledge our <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a>.
                        </div>

                        {/* Checkbox */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '10px' }}>
                            <input type="checkbox" style={{ marginTop: '3px' }} />
                            <span style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.4' }}>
                                The Golf Press and its affiliates may use your email address to send updates, news, ads, and offers. You can opt out or learn more about your rights via the <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a>.
                            </span>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            CREATE ACCOUNT
                        </button>
                    </form>

                    <div className={styles.footer}>
                        Already have an account?
                        <Link href="/login" className={styles.footerLink}>SIGN IN</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
