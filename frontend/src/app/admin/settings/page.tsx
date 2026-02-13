'use client';

import { useState, useEffect } from 'react';
import { fetchSettings, updateSetting } from '@/lib/api';
import styles from './settings.module.css';
import { Save, Globe, Share2, Mail, Info, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await fetchSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error loading settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key: string, value: string) => {
        setSaving(key);
        try {
            await updateSetting(key, value);
            setSuccess(key);
            setTimeout(() => setSuccess(null), 3000);

            // Update local state
            setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
        } catch (error) {
            console.error('Error updating setting', error);
        } finally {
            setSaving(null);
        }
    };

    const getSettingValue = (key: string) => settings.find(s => s.key === key)?.value || '';

    if (loading) return <div className={styles.loading}>Initializing Site configuration...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Global Site Configuration</h1>
                <p>Manage the foundational identity and contact matrix of your platform.</p>
            </div>

            <div className={styles.grid}>
                {/* Identity Section */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <Globe size={20} />
                        <h2>Brand Identity</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label>WEBSITE NAME</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={getSettingValue('site_name')}
                                onChange={(e) => setSettings(prev => prev.map(s => s.key === 'site_name' ? { ...s, value: e.target.value } : s))}
                            />
                            <button
                                onClick={() => handleUpdate('site_name', getSettingValue('site_name'))}
                                disabled={saving === 'site_name'}
                            >
                                {saving === 'site_name' ? '...' : success === 'site_name' ? <CheckCircle size={16} /> : <Save size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>SITE DESCRIPTION (SEO)</label>
                        <div className={styles.inputWrapper}>
                            <textarea
                                value={getSettingValue('site_description')}
                                onChange={(e) => setSettings(prev => prev.map(s => s.key === 'site_description' ? { ...s, value: e.target.value } : s))}
                                rows={3}
                            />
                            <button
                                onClick={() => handleUpdate('site_description', getSettingValue('site_description'))}
                                disabled={saving === 'site_description'}
                            >
                                {saving === 'site_description' ? '...' : success === 'site_description' ? <CheckCircle size={16} /> : <Save size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <Mail size={20} />
                        <h2>Communication Channels</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label>EDITORIAL INQUIRIES</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                value={getSettingValue('contact_email_editorial')}
                                onChange={(e) => setSettings(prev => prev.map(s => s.key === 'contact_email_editorial' ? { ...s, value: e.target.value } : s))}
                            />
                            <button onClick={() => handleUpdate('contact_email_editorial', getSettingValue('contact_email_editorial'))}>
                                {success === 'contact_email_editorial' ? <CheckCircle size={16} /> : <Save size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>ADVERTISING INQUIRIES</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                value={getSettingValue('contact_email_ads')}
                                onChange={(e) => setSettings(prev => prev.map(s => s.key === 'contact_email_ads' ? { ...s, value: e.target.value } : s))}
                            />
                            <button onClick={() => handleUpdate('contact_email_ads', getSettingValue('contact_email_ads'))}>
                                {success === 'contact_email_ads' ? <CheckCircle size={16} /> : <Save size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Section */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <Share2 size={20} />
                        <h2>Social Footprint</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label>INSTAGRAM URL</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="url"
                                value={getSettingValue('social_instagram')}
                                onChange={(e) => setSettings(prev => prev.map(s => s.key === 'social_instagram' ? { ...s, value: e.target.value } : s))}
                            />
                            <button onClick={() => handleUpdate('social_instagram', getSettingValue('social_instagram'))}>
                                {success === 'social_instagram' ? <CheckCircle size={16} /> : <Save size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>TWITTER / X URL</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="url"
                                value={getSettingValue('social_twitter')}
                                onChange={(e) => setSettings(prev => prev.map(s => s.key === 'social_twitter' ? { ...s, value: e.target.value } : s))}
                            />
                            <button onClick={() => handleUpdate('social_twitter', getSettingValue('social_twitter'))}>
                                {success === 'social_twitter' ? <CheckCircle size={16} /> : <Save size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>FACEBOOK URL</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="url"
                                value={getSettingValue('social_facebook')}
                                onChange={(e) => setSettings(prev => prev.map(s => s.key === 'social_facebook' ? { ...s, value: e.target.value } : s))}
                            />
                            <button onClick={() => handleUpdate('social_facebook', getSettingValue('social_facebook'))}>
                                {success === 'social_facebook' ? <CheckCircle size={16} /> : <Save size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.infoFooter}>
                <Info size={16} />
                <p>Changes to global configurations are applied in real-time across the entire platform ecosystem.</p>
            </div>
        </div>
    );
}
