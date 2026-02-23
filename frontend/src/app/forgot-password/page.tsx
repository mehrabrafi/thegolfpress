'use client';
import { useState } from 'react';
import styles from '../login/login.module.css'; // Reusing login styles for consistency
import Link from 'next/link';
import Image from 'next/image';
import { AUTH_BASE_URL } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch(`${AUTH_BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('success');
                setMessage('An email has been sent with instructions to reset your password.');
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageSection}>
                <Image
                    src="https://cdn.thegolfpress.com/signin.png"
                    alt="Reset Password"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            <div className={styles.formSection}>
                <div className={styles.formContent}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/logo.png" alt="The Golf Press" width={200} height={60} className={styles.authLogo} priority />
                    </Link>

                    <h1 className={styles.title}>FORGOT PASSWORD</h1>

                    {status === 'success' ? (
                        <div className={styles.successMessage} style={{ color: '#2ecc71', marginBottom: '20px', textAlign: 'center' }}>
                            {message}
                            <div style={{ marginTop: '20px' }}>
                                <Link href="/login" className={styles.footerLink}>BACK TO LOGIN</Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p style={{ color: '#777', marginBottom: '20px', textAlign: 'center' }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            {status === 'error' && <div className={styles.error}>{message}</div>}
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.group}>
                                    <label>EMAIL</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className={styles.input}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                                    {status === 'loading' ? 'SENDING...' : 'SEND RESET LINK'}
                                </button>
                            </form>
                            <div className={styles.footer}>
                                Remember your password?
                                <Link href="/login" className={styles.footerLink}>SIGN IN</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
