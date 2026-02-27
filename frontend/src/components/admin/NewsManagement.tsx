'use client';

import { useState, useEffect } from 'react';
import { fetchNews, createNews, updateNews, deleteNews, uploadImage, fetchCategories, fetchSubTags } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import styles from '@/app/tgpadmin/news/news.module.css';
import { Search, Plus, Filter, Edit, Trash2, Calendar, User, Tag, Image as ImageIcon, Check, X, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsManagementProps {
    fixedCategory?: string;
    excludeCategories?: string[];
    title?: string;
    categoryTags?: string[];
}

const ITEMS_PER_PAGE = 20;

// Map category to its frontend route prefix
function getPreviewUrl(article: any): string {
    const cat = (article.category || '').toUpperCase();
    switch (cat) {
        case 'LIFESTYLE': return `/lifestyle/${article.id}`;
        case 'EQUIPMENT': return `/equipment/${article.id}`;
        case 'COURSES': return `/courses/${article.id}`;
        case 'GUIDES-TIPS': return `/guides-and-tips/post/${article.id}`;
        default: return `/news/${article.id}`;
    }
}

export default function NewsManagement({
    fixedCategory,
    excludeCategories,
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
        imageAlt: '',
        categoryId: '',
        subTagId: '',
        type: 'REGULAR',
        status: 'PUBLISHED',
        author: '',
        affiliateLink: '',
        latitude: '',
        longitude: '',
        publishedAt: new Date().toISOString().slice(0, 16),
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [subTags, setSubTags] = useState<any[]>([]);

    const [editId, setEditId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(fixedCategory || '');
    const [statusFilter, setStatusFilter] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    // Bulk delete state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadData();
    }, [fixedCategory]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [newsData, catData] = await Promise.all([
                fetchNews(fixedCategory, undefined, 'ALL', undefined, undefined, excludeCategories),
                fetchCategories()
            ]);
            setNews(newsData.data);
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
            imageAlt: '',
            categoryId: formData.categoryId,
            category: formData.category,
            categoryTag: '',
            type: 'REGULAR',
            status: 'PUBLISHED',
            author: '',
            affiliateLink: '',
            latitude: '',
            longitude: '',
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
            subTagId: ''
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
            imageAlt: article.imageAlt || '',
            category: article.category,
            categoryId: article.categoryId || '',
            subTagId: article.subTagId || '',
            categoryTag: article.categoryTag || '',
            type: article.type,
            status: article.status || 'PUBLISHED',
            author: article.author || '',
            affiliateLink: article.affiliateLink || '',
            latitude: article.latitude || '',
            longitude: article.longitude || '',
            publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
        });

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
            setSelectedIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            loadData();
        } catch (error) {
            console.error('Error deleting news', error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected article(s)? This action cannot be undone.`)) return;

        try {
            const deletePromises = Array.from(selectedIds).map(id => deleteNews(id));
            await Promise.all(deletePromises);
            setSelectedIds(new Set());
            loadData();
        } catch (error) {
            console.error('Error in bulk delete', error);
            alert('Some articles may not have been deleted. Refreshing list.');
            loadData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                latitude: (formData.latitude !== '' && formData.latitude !== null && formData.latitude !== undefined) ? parseFloat(formData.latitude) : undefined,
                longitude: (formData.longitude !== '' && formData.longitude !== null && formData.longitude !== undefined) ? parseFloat(formData.longitude) : undefined,
                categoryId: formData.categoryId || undefined,
                subTagId: formData.subTagId || undefined
            };

            if (editId) {
                await updateNews(editId, payload);
            } else {
                await createNews(payload);
            }

            setIsEditing(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error('Error saving news', error);
            alert(error.message || 'Failed to save news. Please check console for details.');
        }
    };

    // Filtered articles
    const filteredNews = news.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = fixedCategory || categoryFilter === '' || article.category === categoryFilter;
        const matchesStatus = statusFilter === '' || article.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds(new Set());
    }, [searchTerm, categoryFilter, statusFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedNews = filteredNews.slice(startIdx, endIdx);

    // Select helpers
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        const allOnPageIds = paginatedNews.map(a => a.id);
        const allSelected = allOnPageIds.every(id => selectedIds.has(id));
        if (allSelected) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                allOnPageIds.forEach(id => next.delete(id));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                allOnPageIds.forEach(id => next.add(id));
                return next;
            });
        }
    };

    const allOnPageSelected = paginatedNews.length > 0 && paginatedNews.every(a => selectedIds.has(a.id));

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
                    {isEditing ? <><X size={18} /> Cancel</> : <Plus size={18} />}
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
                                <label>AUTHOR NAME</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="e.g. Tiger Woods"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>AFFILIATE LINK</label>
                                <input
                                    type="url"
                                    value={formData.affiliateLink}
                                    onChange={e => setFormData({ ...formData, affiliateLink: e.target.value })}
                                    placeholder="e.g. https://amzn.to/..."
                                />
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

                        {(!fixedCategory || fixedCategory === 'COURSES') && (
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>LATITUDE (Maps)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                        placeholder="e.g. 36.5683"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>LONGITUDE (Maps)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                        placeholder="e.g. -121.9515"
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.row}>
                            <div className={styles.formGroup} style={{ flex: 2 }}>
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
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label>IMAGE ALT TEXT (SEO)</label>
                                <input
                                    type="text"
                                    value={formData.imageAlt}
                                    onChange={e => setFormData({ ...formData, imageAlt: e.target.value })}
                                    placeholder="e.g. Tiger Woods playing golf"
                                />
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

                    {/* Bulk Actions Bar */}
                    {selectedIds.size > 0 && (
                        <div className={styles.bulkBar}>
                            <span className={styles.bulkBarText}>
                                <Check size={14} /> {selectedIds.size} article{selectedIds.size > 1 ? 's' : ''} selected
                            </span>
                            <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                                <Trash2 size={14} /> Delete Selected
                            </button>
                            <button className={styles.bulkClearBtn} onClick={() => setSelectedIds(new Set())}>
                                <X size={14} /> Clear Selection
                            </button>
                        </div>
                    )}

                    <div className={styles.newsList}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            checked={allOnPageSelected}
                                            onChange={toggleSelectAll}
                                            className={styles.checkbox}
                                            title="Select all on this page"
                                        />
                                    </th>
                                    <th>Headline</th>
                                    {!fixedCategory && <th>Category</th>}
                                    <th>Sub-Tag</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedNews.length > 0 ? paginatedNews.map(article => (
                                    <tr key={article.id} className={selectedIds.has(article.id) ? styles.selectedRow : ''}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(article.id)}
                                                onChange={() => toggleSelect(article.id)}
                                                className={styles.checkbox}
                                            />
                                        </td>
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
                                                <a
                                                    href={getPreviewUrl(article)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.previewBtn}
                                                    title="Preview"
                                                >
                                                    <Eye size={16} />
                                                </a>
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
                                        <td colSpan={fixedCategory ? 6 : 7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                            No entries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <span className={styles.pageInfo}>
                                Showing {startIdx + 1}–{Math.min(endIdx, filteredNews.length)} of {filteredNews.length} articles
                            </span>
                            <div className={styles.pageControls}>
                                <button
                                    className={styles.pageBtn}
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    title="First page"
                                >
                                    &#171;
                                </button>
                                <button
                                    className={styles.pageBtn}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    disabled={currentPage === 1}
                                    title="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // Show first, last, current, and neighbors
                                        if (page === 1 || page === totalPages) return true;
                                        if (Math.abs(page - currentPage) <= 1) return true;
                                        return false;
                                    })
                                    .reduce<(number | string)[]>((acc, page, idx, arr) => {
                                        if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                                            acc.push('...');
                                        }
                                        acc.push(page);
                                        return acc;
                                    }, [])
                                    .map((item, idx) =>
                                        typeof item === 'string' ? (
                                            <span key={`ellipsis-${idx}`} className={styles.pageEllipsis}>…</span>
                                        ) : (
                                            <button
                                                key={item}
                                                className={`${styles.pageBtn} ${currentPage === item ? styles.pageBtnActive : ''}`}
                                                onClick={() => setCurrentPage(item)}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}

                                <button
                                    className={styles.pageBtn}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    disabled={currentPage === totalPages}
                                    title="Next page"
                                >
                                    <ChevronRight size={16} />
                                </button>
                                <button
                                    className={styles.pageBtn}
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    title="Last page"
                                >
                                    &#187;
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
