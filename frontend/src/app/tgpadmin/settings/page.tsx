'use client';

import { useState, useEffect } from 'react';
import { fetchSettings, updateSetting, fetchMaintenanceStatus, formatDatabase } from '@/lib/api';
import styles from './settings.module.css';
import { Save, Globe, Share2, Mail, Info, CheckCircle, Shield, AlertTriangle, Trash2, Database, X } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [maintenanceOn, setMaintenanceOn] = useState(false);
    const [maintenanceLoading, setMaintenanceLoading] = useState(false);
    const [maintenanceEndTime, setMaintenanceEndTime] = useState('');
    const [registrationOn, setRegistrationOn] = useState(true);
    const [registrationLoading, setRegistrationLoading] = useState(false);

    // Format Database state
    const [showFormatModal, setShowFormatModal] = useState(false);
    const [formatConfirmText, setFormatConfirmText] = useState('');
    const [formatting, setFormatting] = useState(false);
    const [formatResult, setFormatResult] = useState<any>(null);
    const [formatError, setFormatError] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
        loadMaintenanceStatus();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await fetchSettings();
            setSettings(data);

            const regSetting = data.find((s: any) => s.key === 'allow_registration');
            if (regSetting) {
                setRegistrationOn(regSetting.value === 'true');
            } else {
                setRegistrationOn(true); // default if not in DB
            }
        } catch (error) {
            console.error('Error loading settings', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMaintenanceStatus = async () => {
        try {
            const data = await fetchMaintenanceStatus();
            setMaintenanceOn(data.enabled);
            if (data.endTime) {
                // Convert ISO string to datetime-local format
                const d = new Date(data.endTime);
                setMaintenanceEndTime(d.toISOString().slice(0, 16));
            }
        } catch {
            setMaintenanceOn(false);
        }
    };

    const handleToggleMaintenance = async () => {
        setMaintenanceLoading(true);
        const newValue = !maintenanceOn;
        try {
            await updateSetting('maintenance_mode', String(newValue));
            setMaintenanceOn(newValue);
            // If turning OFF, clear the end time
            if (!newValue) {
                await updateSetting('maintenance_end_time', '');
                setMaintenanceEndTime('');
            }
            setSuccess('maintenance_mode');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error toggling maintenance mode', error);
        } finally {
            setMaintenanceLoading(false);
        }
    };

    const handleToggleRegistration = async () => {
        setRegistrationLoading(true);
        const newValue = !registrationOn;
        try {
            await updateSetting('allow_registration', String(newValue));
            setRegistrationOn(newValue);
            setSuccess('allow_registration');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error toggling registration', error);
        } finally {
            setRegistrationLoading(false);
        }
    };

    const handleSaveEndTime = async () => {
        setSaving('maintenance_end_time');
        try {
            const isoValue = maintenanceEndTime ? new Date(maintenanceEndTime).toISOString() : '';
            await updateSetting('maintenance_end_time', isoValue);
            setSuccess('maintenance_end_time');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error saving end time', error);
        } finally {
            setSaving(null);
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

    const handleFormatDatabase = async () => {
        if (formatConfirmText !== 'FORMAT') return;
        setFormatting(true);
        setFormatError(null);
        setFormatResult(null);
        try {
            const result = await formatDatabase();
            setFormatResult(result);
            setFormatConfirmText('');
        } catch (error: any) {
            setFormatError(error.message || 'Failed to format database');
        } finally {
            setFormatting(false);
        }
    };

    const closeFormatModal = () => {
        setShowFormatModal(false);
        setFormatConfirmText('');
        setFormatResult(null);
        setFormatError(null);
    };

    if (loading) return <div className={styles.loading}>Initializing Site configuration...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Global Site Configuration</h1>
                <p>Manage the foundational identity and contact matrix of your platform.</p>
            </div>

            {/* ── Registration Toggle Card ────────────────────────────── */}
            <div className={`${styles.maintenanceCard} ${!registrationOn ? styles.maintenanceActive : ''}`} style={{ marginBottom: '20px' }}>
                <div className={styles.maintenanceTop}>
                    <div className={styles.maintenanceLeft}>
                        <div className={`${styles.maintenanceIcon} ${!registrationOn ? styles.maintenanceIconActive : ''}`}>
                            {!registrationOn ? <AlertTriangle size={24} /> : <Shield size={24} />}
                        </div>
                        <div>
                            <h2 className={styles.maintenanceTitle}>Registration System</h2>
                            <p className={styles.maintenanceDesc}>
                                {registrationOn
                                    ? 'Users can currently sign up for new accounts.'
                                    : 'Registration is currently disabled. New users cannot sign up.'
                                }
                            </p>
                        </div>
                    </div>
                    <div className={styles.maintenanceRight}>
                        {success === 'allow_registration' && (
                            <span className={styles.maintenanceSaved}>
                                <CheckCircle size={14} /> Saved
                            </span>
                        )}
                        <button
                            className={`${styles.toggleBtn} ${registrationOn ? styles.toggleOn : styles.toggleOff}`}
                            onClick={handleToggleRegistration}
                            disabled={registrationLoading}
                            aria-label="Toggle registration"
                        >
                            <span className={styles.toggleKnob}></span>
                            <span className={styles.toggleLabel}>{registrationOn ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Maintenance Mode Card ────────────────────────────── */}
            <div className={`${styles.maintenanceCard} ${maintenanceOn ? styles.maintenanceActive : ''}`}>
                <div className={styles.maintenanceTop}>
                    <div className={styles.maintenanceLeft}>
                        <div className={`${styles.maintenanceIcon} ${maintenanceOn ? styles.maintenanceIconActive : ''}`}>
                            {maintenanceOn ? <AlertTriangle size={24} /> : <Shield size={24} />}
                        </div>
                        <div>
                            <h2 className={styles.maintenanceTitle}>Maintenance Mode</h2>
                            <p className={styles.maintenanceDesc}>
                                {maintenanceOn
                                    ? 'Site is currently offline for visitors. Only admins can browse.'
                                    : 'Enable to take the site offline for updates, fixes, or deployments.'
                                }
                            </p>
                        </div>
                    </div>
                    <div className={styles.maintenanceRight}>
                        {success === 'maintenance_mode' && (
                            <span className={styles.maintenanceSaved}>
                                <CheckCircle size={14} /> Saved
                            </span>
                        )}
                        <button
                            className={`${styles.toggleBtn} ${maintenanceOn ? styles.toggleOn : styles.toggleOff}`}
                            onClick={handleToggleMaintenance}
                            disabled={maintenanceLoading}
                            aria-label="Toggle maintenance mode"
                        >
                            <span className={styles.toggleKnob}></span>
                            <span className={styles.toggleLabel}>{maintenanceOn ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>
                </div>

                {/* Estimated End Time — only visible when maintenance is ON */}
                {maintenanceOn && (
                    <div className={styles.maintenanceEndTime}>
                        <div className={styles.formGroup}>
                            <label>ESTIMATED END TIME (shown as countdown to visitors)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="datetime-local"
                                    value={maintenanceEndTime}
                                    onChange={(e) => setMaintenanceEndTime(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                                <button
                                    onClick={handleSaveEndTime}
                                    disabled={saving === 'maintenance_end_time'}
                                >
                                    {saving === 'maintenance_end_time' ? '...' : success === 'maintenance_end_time' ? <CheckCircle size={16} /> : <Save size={16} />}
                                </button>
                            </div>
                            <span className={styles.endTimeHint}>
                                {maintenanceEndTime
                                    ? `Visitors will see a countdown until ${new Date(maintenanceEndTime).toLocaleString()}`
                                    : 'No end time set — visitors will see the progress bar only'
                                }
                            </span>
                        </div>
                    </div>
                )}
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

            {/* ── Danger Zone: Format Database ──────────────────── */}
            <div className={styles.dangerZone}>
                <div className={styles.dangerHeader}>
                    <Trash2 size={20} />
                    <h2>Danger Zone</h2>
                </div>
                <div className={styles.dangerContent}>
                    <div className={styles.dangerInfo}>
                        <div className={styles.dangerIconWrap}>
                            <Database size={24} />
                        </div>
                        <div>
                            <h3>Format Database</h3>
                            <p>Permanently delete all content from the database including News, Categories, Sub-Tags, Players, Settings, and Analytics. <strong>User accounts will be preserved.</strong></p>
                        </div>
                    </div>
                    <button
                        className={styles.dangerBtn}
                        onClick={() => setShowFormatModal(true)}
                    >
                        <Trash2 size={16} />
                        Format Database
                    </button>
                </div>
            </div>

            {/* ── Format Database Confirmation Modal ────────────── */}
            {showFormatModal && (
                <div className={styles.modalOverlay} onClick={closeFormatModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={closeFormatModal}>
                            <X size={20} />
                        </button>

                        <div className={styles.modalIcon}>
                            <AlertTriangle size={32} />
                        </div>

                        <h2 className={styles.modalTitle}>Format Database</h2>
                        <p className={styles.modalDesc}>
                            This action is <strong>irreversible</strong>. All content will be permanently deleted:
                        </p>

                        <ul className={styles.modalList}>
                            <li>📰 All News Articles</li>
                            <li>📂 All Categories & Sub-Tags</li>
                            <li>🏌️ All Players</li>
                            <li>⚙️ All Settings</li>
                            <li>📊 All Analytics & Activity Data</li>
                        </ul>

                        <p className={styles.modalPreserve}>
                            ✅ <strong>User accounts</strong> (credentials, profiles, roles) will be <strong>preserved</strong>.
                        </p>

                        {formatResult ? (
                            <div className={styles.formatResultBox}>
                                <CheckCircle size={20} />
                                <div>
                                    <strong>Database Formatted Successfully!</strong>
                                    <ul className={styles.resultList}>
                                        <li>News deleted: <strong>{formatResult.deleted?.deletedNews || 0}</strong></li>
                                        <li>Categories deleted: <strong>{formatResult.deleted?.deletedCategories || 0}</strong></li>
                                        <li>Sub-Tags deleted: <strong>{formatResult.deleted?.deletedSubTags || 0}</strong></li>
                                        <li>Players deleted: <strong>{formatResult.deleted?.deletedPlayers || 0}</strong></li>
                                        <li>Settings deleted: <strong>{formatResult.deleted?.deletedSettings || 0}</strong></li>
                                        <li>Analytics deleted: <strong>{formatResult.deleted?.deletedAnalytics || 0}</strong></li>
                                        <li>Activity logs deleted: <strong>{formatResult.deleted?.deletedDailyActivity || 0}</strong></li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <>
                                {formatError && (
                                    <div className={styles.formatErrorBox}>
                                        ❌ {formatError}
                                    </div>
                                )}

                                <div className={styles.confirmInput}>
                                    <label>Type <strong>FORMAT</strong> to confirm:</label>
                                    <input
                                        type="text"
                                        value={formatConfirmText}
                                        onChange={(e) => setFormatConfirmText(e.target.value.toUpperCase())}
                                        placeholder="TYPE FORMAT"
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.modalActions}>
                                    <button className={styles.cancelBtn} onClick={closeFormatModal}>
                                        Cancel
                                    </button>
                                    <button
                                        className={styles.confirmDeleteBtn}
                                        disabled={formatConfirmText !== 'FORMAT' || formatting}
                                        onClick={handleFormatDatabase}
                                    >
                                        {formatting ? (
                                            <span className={styles.spinnerText}>Formatting...</span>
                                        ) : (
                                            <><Trash2 size={16} /> Delete All Content</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.infoFooter}>
                <Info size={16} />
                <p>Changes to global configurations are applied in real-time across the entire platform ecosystem.</p>
            </div>
        </div>
    );
}
