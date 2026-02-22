'use client';

import { useState, useEffect } from 'react';
import {
    fetchAllPlayers,
    adminCreatePlayer,
    adminUpdatePlayer,
    adminDeletePlayer,
    uploadImage
} from '@/lib/api';
import styles from '@/app/tgpadmin/news/news.module.css';
import { Search, Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';

export default function PlayerManagement() {
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        slug: '',
        image: ''
    });
    const [editId, setEditId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchAllPlayers();
            setPlayers(data);
        } catch (error) {
            console.error('Error loading players', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            image: ''
        });
        setEditId(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await uploadImage(file);
            setFormData((prev: any) => ({ ...prev, image: data.url }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (player: any) => {
        setFormData({
            name: player.name,
            slug: player.slug,
            image: player.image || ''
        });
        setEditId(player.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this player?')) return;
        try {
            await adminDeletePlayer(id);
            loadData();
        } catch (error) {
            console.error('Error deleting player', error);
            alert('Failed to delete player');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await adminUpdatePlayer(editId, formData);
            } else {
                await adminCreatePlayer(formData);
            }

            setIsEditing(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving player', error);
            alert('Failed to save player profile');
        }
    };

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && players.length === 0) return <div className={styles.loading}>Loading Players...</div>;

    return (
        <div>
            <div className={styles.header}>
                <h1>Manage Players</h1>
                <button
                    className={styles.addBtn}
                    onClick={() => {
                        if (isEditing) {
                            setIsEditing(false);
                            resetForm();
                        } else {
                            resetForm();
                            setIsEditing(true);
                        }
                    }}
                >
                    {isEditing ? <><X size={18} /> Cancel</> : <Plus size={18} />}
                </button>
            </div>

            {isEditing && (
                <div className={styles.formCard}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                        {editId ? 'Modify Player Profile' : 'Add New Pro Golfer'}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>PLAYER NAME</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => {
                                        const name = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name,
                                            slug: editId ? formData.slug : name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                        });
                                    }}
                                    placeholder="e.g. Scottie Scheffler"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>SLUG (URL KEY)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g. scottie-scheffler"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>HEADSHOT / PROFILE IMAGE</label>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                {formData.image && (
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="Paste image URL or upload..."
                                            style={{ flex: 1 }}
                                        />
                                        <input
                                            type="file"
                                            id="player-img-upload"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                        />
                                        <label htmlFor="player-img-upload" className={styles.uploadBtn}>
                                            <ImageIcon size={18} /> {uploading ? 'Processing...' : 'Upload'}
                                        </label>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px' }}>
                                        Recommended: Transparent PNG or square headshot.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={uploading}>
                            {editId ? 'Update Player' : 'Save Player'}
                        </button>
                    </form>
                </div>
            )}

            {!isEditing && (
                <>
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label><Search size={14} style={{ marginRight: '5px' }} /> Search Players</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Filter by name or slug..."
                            />
                        </div>
                    </div>

                    <div className={styles.newsList}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Slug</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayers.length > 0 ? filteredPlayers.map(player => (
                                    <tr key={player.id}>
                                        <td className={styles.titleCell}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img
                                                    src={player.image || 'https://a.espncdn.com/i/headshots/nophoto.png'}
                                                    alt=""
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                                />
                                                <span style={{ fontWeight: 600 }}>{player.name}</span>
                                            </div>
                                        </td>
                                        <td><code>{player.slug}</code></td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button onClick={() => handleEdit(player)} className={styles.editBtn} title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(player.id)} className={styles.deleteBtn} title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                            No players found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
