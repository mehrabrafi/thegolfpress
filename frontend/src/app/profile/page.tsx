'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile, uploadProfileImage, deleteUserAccount, getProfile } from '@/lib/api';
import styles from './Profile.module.css';

export default function ProfilePage() {
    const { user, setUser, logout } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setImage(user.image || '');
        }
    }, [user]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { url } = await uploadProfileImage(file);
            setImage(url);
            setMessage({ type: 'success', text: 'Image uploaded! Don\'t forget to save changes.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to upload image' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const updatedUser = await updateUserProfile({ name, image });
            setUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await deleteUserAccount();
            logout();
            router.push('/');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete account' });
            setShowDeleteModal(false);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container">
            <div className={styles.profileContainer}>
                <h1 className={styles.title}>Edit Profile</h1>

                <div className={styles.profileSection}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            {image ? (
                                <Image
                                    src={image}
                                    alt="Profile"
                                    fill
                                    className={styles.avatarImage}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {name ? name.charAt(0) : user.email.charAt(0)}
                                </div>
                            )}
                        </div>
                        <label className={styles.uploadLabel}>
                            Change Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading}
                            />
                        </label>
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email Address (Cannot be changed)</label>
                            <input
                                type="text"
                                value={user.email}
                                className={styles.input}
                                disabled
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                                placeholder="Enter your name"
                                disabled={loading}
                            />
                        </div>

                        {message.text && (
                            <div className={`${styles.message} ${styles[message.type]}`}>
                                {message.text}
                            </div>
                        )}

                        <div className={styles.actions}>
                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={loading || (!name && !image)}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Delete Account?</h2>
                        <p className={styles.modalText}>
                            This action is permanent and cannot be undone. All your preferences and followed players will be lost.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowDeleteModal(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmDeleteBtn}
                                onClick={handleDeleteAccount}
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
