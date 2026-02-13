'use client';

import { useState, useEffect } from 'react';
import { fetchNews, createNews, updateNews, deleteNews, uploadImage, fetchCategories, fetchSubTags } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import styles from '@/app/tgpadmin/news/news.module.css';
import { Search, Plus, Filter, Edit, Trash2, Calendar, User, Tag, Image as ImageIcon, Check, X, Clock } from 'lucide-react';

interface NewsManagementProps {
    fixedCategory?: string;
    title?: string;
    categoryTags?: string[];
}

export default function NewsManagement({
    fixedCategory,
    title = "News Management",
    categoryTags = []
}: NewsManagementProps) {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        categoryId: '',
        subTagId: '',
        type: 'REGULAR',
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString().slice(0, 16),

    });
    const [categories, setCategories] = useState<any[]>([]);
    const [subTags, setSubTags] = useState<any[]>([]);

    const [editId, setEditId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(fixedCategory || '');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadData();
    }, [fixedCategory]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [newsData, catData] = await Promise.all([
                fetchNews(fixedCategory),
                fetchCategories()
            ]);
            setNews(newsData);
            setCategories(catData);



            // If fixedCategory is provided, handle it
            if (fixedCategory) {
                const matchedCat = catData.find((c: any) => c.slug === fixedCategory.toLowerCase() || c.name.toLowerCase() === fixedCategory.toLowerCase());

                setFormData((prev: any) => ({
                    ...prev,
                    categoryId: matchedCat ? matchedCat.id : '',
                    category: matchedCat ? matchedCat.name : fixedCategory
                }));

                if (matchedCat) {
                    // Fetch subtags for fixed category
                    const subTagData = await fetchSubTags(matchedCat.id);
                    setSubTags(subTagData);
                }
            }
        } catch (error) {
            console.error('Error loading data', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            categoryId: formData.categoryId, // Preserve if fixed
            category: formData.category,     // Preserve if fixed
            categoryTag: '',
            type: 'REGULAR',
            status: 'PUBLISHED',
            publishedAt: new Date().toISOString().slice(0, 16)
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
        } finally {
            setUploading(false);
        }
    };

    const handleCategoryChange = async (catId: string) => {
        const cat = categories.find(c => c.id === catId);
        setFormData((prev: any) => ({
            ...prev,
            categoryId: catId,
            category: cat ? cat.name : prev.category,
            subTagId: '' // Reset subtag on category change
        }));

        if (catId) {
            try {
                const data = await fetchSubTags(catId);
                setSubTags(data);
            } catch (error) {
                console.error('Error fetching subtags', error);
                setSubTags([]);
            }
        } else {
            setSubTags([]);
        }
    };

    const handleEdit = (article: any) => {
        setFormData({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            image: article.image || '',
            category: article.category,
            categoryId: article.categoryId || '',
            subTagId: article.subTagId || '',
            categoryTag: article.categoryTag || '',
            type: article.type,
            status: article.status || 'PUBLISHED',
            publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
        });

        // Trigger subtags fetch for editing
        if (article.categoryId) {
            fetchSubTags(article.categoryId).then(setSubTags).catch(() => setSubTags([]));
        }

        setEditId(article.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            await deleteNews(id);
            loadData();
        } catch (error) {
            console.error('Error deleting news', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateNews(editId, formData);
            } else {
                await createNews(formData);
            }

            setIsEditing(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving news', error);
        }
    };

    const filteredNews = news.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = fixedCategory || categoryFilter === '' || article.category === categoryFilter;
        const matchesStatus = statusFilter === '' || article.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return styles.statusPublished;
            case 'DRAFT': return styles.statusDraft;
            case 'SCHEDULED': return styles.statusScheduled;
            default: return '';
        }
    };

    if (loading && news.length === 0) return <div className={styles.loading}>Loading {title}...</div>;

    return (
        <div>
            <div className={styles.header}>
                <h1>{title}</h1>
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
                    {isEditing ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Entry</>}
                </button>
            </div>

            {isEditing && (
                <div className={styles.formCard}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                        {editId ? 'Modify Entry' : `Create New ${fixedCategory || 'Entry'}`}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>HEADLINE</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter a compelling title..."
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            {!fixedCategory && (
                                <div className={styles.formGroup}>
                                    <label>CATEGORY</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={e => handleCategoryChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}


                            <div className={styles.formGroup}>
                                <label>SUB-TAG / SECTION</label>
                                {subTags.length > 0 ? (
                                    <select
                                        value={formData.subTagId}
                                        onChange={e => {
                                            const subTagId = e.target.value;
                                            const subTag = subTags.find(s => s.id === subTagId);
                                            setFormData({
                                                ...formData,
                                                subTagId,
                                                categoryTag: subTag ? subTag.name : formData.categoryTag
                                            });
                                        }}
                                    >
                                        <option value="">None</option>
                                        {subTags.map(tag => (
                                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData.categoryTag}
                                        onChange={e => setFormData({ ...formData, categoryTag: e.target.value })}
                                        placeholder="e.g. PGA TOUR, SCOTLAND"
                                    />
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>ARTICLE TYPE</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="REGULAR">Regular</option>
                                    <option value="FEATURED">Hero/Featured</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>CONTENT STATUS</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="PUBLISHED">Published</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="SCHEDULED">Scheduled</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>PUBLISH DATE & TIME</label>
                                <input
                                    type="datetime-local"
                                    value={formData.publishedAt}
                                    onChange={e => setFormData({ ...formData, publishedAt: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>FEATURED IMAGE URL</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Paste URL or upload image..."
                                    style={{ flex: 1 }}
                                    required
                                />
                                <input
                                    type="file"
                                    id="img-upload-comp"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                                <label htmlFor="img-upload-comp" className={styles.uploadBtn}>
                                    <ImageIcon size={18} /> {uploading ? 'Processing...' : 'Upload'}
                                </label>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>SUMMARY / EXCERPT</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="A short summary..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>FULL CONTENT</label>
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(html: string) => setFormData({ ...formData, content: html })}
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            {editId ? 'Update & Save' : 'Save Entry'}
                        </button>
                    </form>
                </div>
            )}

            {!isEditing && (
                <>
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label><Search size={14} style={{ marginRight: '5px' }} /> Search Entries</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Filter by title..."
                            />
                        </div>
                        {!fixedCategory && (
                            <div className={styles.filterGroup}>
                                <label><Tag size={14} style={{ marginRight: '5px' }} /> Category</label>
                                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className={styles.filterGroup}>
                            <label><Clock size={14} style={{ marginRight: '5px' }} /> Status</label>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="DRAFT">Draft</option>
                                <option value="SCHEDULED">Scheduled</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.newsList}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Headline</th>
                                    {!fixedCategory && <th>Category</th>}
                                    <th>Sub-Tag</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNews.length > 0 ? filteredNews.map(article => (
                                    <tr key={article.id}>
                                        <td className={styles.titleCell}>
                                            {article.title}
                                            {article.type === 'FEATURED' && <span className={styles.featuredBadge}>HERO</span>}
                                        </td>
                                        {!fixedCategory && <td>{article.category}</td>}
                                        <td>{article.categoryTag || '-'}</td>
                                        <td>
                                            <span className={getStatusStyle(article.status || 'PUBLISHED')}>
                                                {article.status || 'PUBLISHED'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button onClick={() => handleEdit(article)} className={styles.editBtn} title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(article.id)} className={styles.deleteBtn} title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={fixedCategory ? 4 : 5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                            No entries found.
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
