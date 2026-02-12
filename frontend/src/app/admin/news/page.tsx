'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchNews, createNews, updateNews, deleteNews, uploadImage } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import styles from './news.module.css';

import { Suspense } from 'react';

function AdminNewsContent() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        categoryTag: '',
        type: 'REGULAR'
    });
    const [editId, setEditId] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        loadNews();
        if (searchParams.get('action') === 'new') {
            setIsEditing(true);
        }
    }, [searchParams]);

    const loadNews = async () => {
        try {
            const data = await fetchNews();
            setNews(data);
        } catch (error) {
            console.error('Error loading news', error);
        } finally {
            setLoading(false);
        }
    };

    const [selectedFileName, setSelectedFileName] = useState('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFileName(file.name);
        setUploading(true);
        console.log('Starting image upload for:', file.name);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication session expired. Please log in again.');
                return;
            }
            const data = await uploadImage(file, token);
            console.log('Image upload successful:', data.url);
            setFormData({ ...formData, image: data.url });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Check console for details.');
        } finally {
            setUploading(false);
        }
    };


    const handleEdit = (article: any) => {
        setFormData({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            image: article.image,
            category: article.category,
            categoryTag: article.categoryTag,
            type: article.type
        });
        setEditId(article.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await deleteNews(id, token);
            loadNews();
        } catch (error) {
            console.error('Error deleting news', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (editId) {
                await updateNews(editId, formData, token);
            } else {
                await createNews(formData, token);
            }

            setIsEditing(false);
            setEditId(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                image: '',
                category: '',
                categoryTag: '',
                type: 'REGULAR'
            });
            loadNews();
        } catch (error) {
            console.error('Error saving news', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className={styles.header}>
                <h1>Manage News</h1>
                <button
                    className={styles.addBtn}
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setEditId(null);
                        setFormData({
                            title: '', excerpt: '', content: '', image: '', category: '', categoryTag: '', type: 'REGULAR'
                        });
                    }}
                >
                    {isEditing ? 'Cancel' : 'Add New Article'}
                </button>
            </div>

            {isEditing && (
                <div className={styles.formCard}>
                    <h2>{editId ? 'Edit Article' : 'New Article'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="TOURNAMENT">Tournament</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                    <option value="INSTRUCTION">Instruction</option>
                                    <option value="LIFESTYLE">Lifestyle</option>
                                    <option value="BREAKING">Breaking</option>
                                    <option value="COURSES">Courses</option>
                                    <option value="HOW-TO">How-To</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tag</label>
                                <input
                                    type="text"
                                    value={formData.categoryTag}
                                    onChange={e => setFormData({ ...formData, categoryTag: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="REGULAR">Regular</option>
                                    <option value="FEATURED">Featured</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Image</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    required
                                    placeholder="Enter URL or upload file..."
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="imageUpload"
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className={styles.uploadBtn}
                                    style={{
                                        padding: '10px 15px',
                                        background: '#e2e8f0',
                                        color: '#333',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {uploading ? 'Uploading...' : 'Upload File'}
                                </label>
                            </div>
                            {selectedFileName && (
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>
                                    Selected: {selectedFileName} {uploading && '(Uploading...)'}
                                </div>
                            )}
                            {formData.image && (
                                <div style={{ marginTop: '10px' }}>
                                    <img src={formData.image} alt="Preview" style={{ height: '100px', borderRadius: '4px' }} />
                                    <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '5px' }}>✓ Uploaded successfully</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                required
                                rows={2}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Content</label>
                            <div style={{ minHeight: '300px' }}>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(html: string) => setFormData({ ...formData, content: html })}
                                />
                            </div>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            {editId ? 'Update Article' : 'Publish Article'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.newsList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map(article => (
                            <tr key={article.id}>
                                <td className={styles.titleCell}>{article.title}</td>
                                <td>{article.category}</td>
                                <td>
                                    <span className={article.type === 'FEATURED' ? styles.featured : styles.regular}>
                                        {article.type}
                                    </span>
                                </td>
                                <td>{article.time}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button onClick={() => handleEdit(article)} className={styles.editBtn}>Edit</button>
                                        <button onClick={() => handleDelete(article.id)} className={styles.deleteBtn}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function AdminNewsPage() {
    return (
        <Suspense fallback={<div>Loading Page...</div>}>
            <AdminNewsContent />
        </Suspense>
    );
}
