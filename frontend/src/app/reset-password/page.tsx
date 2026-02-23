'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../login/login.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { AUTH_BASE_URL } from '@/lib/api';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch(`${AUTH_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                setStatus('success');
                setMessage('Your password has been reset successfully. Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Something went wrong.');
            }
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    if (!token && status === 'error') {
        return (
            <div className={styles.error} style={{ textAlign: 'center' }}>
                {message}
                <div style={{ marginTop: '20px' }}>
                    <Link href="/forgot-password" className={styles.footerLink}>REQUEST NEW LINK</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className={styles.title}>NEW PASSWORD</h1>

            {status === 'success' && (
                <div style={{ color: '#2ecc71', marginBottom: '20px', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            {status === 'error' && <div className={styles.error}>{message}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label>NEW PASSWORD</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className={styles.input}
                        minLength={8}
                    />
                </div>

                <div className={styles.group}>
                    <label>CONFIRM PASSWORD</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                        minLength={8}
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === 'loading' || status === 'success'}>
                    {status === 'loading' ? 'RESETTING...' : 'RESET PASSWORD'}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
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

                    <Suspense fallback={<div>Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className={styles.footer}>
                        <Link href="/login" className={styles.footerLink}>BACK TO LOGIN</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
