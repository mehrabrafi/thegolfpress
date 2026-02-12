'use client';

import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, fetchSubTags, createSubTag, deleteSubTag } from '@/lib/api';
import styles from '@/app/admin/news/news.module.css';
import { Search, Plus, Edit, Trash2, Tag, X, Check, ChevronDown, ChevronRight } from 'lucide-react';

export default function CategoryManagement() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        slug: ''
    });
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [newSubTagName, setNewSubTagName] = useState<Record<string, string>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedCategories(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAddSubTag = async (categoryId: string) => {
        const name = newSubTagName[categoryId];
        if (!name) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await createSubTag({ name, categoryId }, token);
            setNewSubTagName(prev => ({ ...prev, [categoryId]: '' }));
            loadData();
        } catch (error) {
            console.error('Error adding sub-tag', error);
        }
    };

    const handleDeleteSubTag = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sub-tag?')) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await deleteSubTag(id, token);
            loadData();
        } catch (error) {
            console.error('Error deleting sub-tag', error);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', slug: '' });
        setEditId(null);
    };

    const handleEdit = (category: any) => {
        setFormData({
            name: category.name,
            slug: category.slug
        });
        setEditId(category.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? Articles under this category may become uncategorized.')) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await deleteCategory(id, token);
            loadData();
        } catch (error) {
            console.error('Error deleting category', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (editId) {
                await updateCategory(editId, formData, token);
            } else {
                await createCategory(formData, token);
            }

            setIsEditing(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving category', error);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && categories.length === 0) return <div className={styles.loading}>Loading Categories...</div>;

    return (
        <div>
            <div className={styles.header}>
                <h1>Category Management</h1>
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
                    {isEditing ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Category</>}
                </button>
            </div>

            {isEditing && (
                <div className={styles.formCard}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                        {editId ? 'Modify Category' : 'Create New Category'}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>CATEGORY NAME</label>
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
                                    placeholder="e.g. Equipment"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>SLUG (URL KEY)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g. equipment"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            {editId ? 'Update & Save' : 'Save Category'}
                        </button>
                    </form>
                </div>
            )}

            {!isEditing && (
                <>
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label><Search size={14} style={{ marginRight: '5px' }} /> Search Categories</label>
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
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Articles Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length > 0 ? filteredCategories.map(cat => (
                                    <React.Fragment key={cat.id}>
                                        <tr>
                                            <td className={styles.titleCell}>
                                                <button
                                                    onClick={() => toggleExpand(cat.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px', marginRight: '5px' }}
                                                >
                                                    {expandedCategories.includes(cat.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </button>
                                                <Tag size={16} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#64748b' }} />
                                                {cat.name}
                                            </td>
                                            <td><code>{cat.slug}</code></td>
                                            <td>{cat._count?.news || 0} articles</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button onClick={() => handleEdit(cat)} className={styles.editBtn} title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(cat.id)} className={styles.deleteBtn} title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedCategories.includes(cat.id) && (
                                            <tr style={{ background: '#f8fafc' }}>
                                                <td colSpan={4} style={{ padding: '15px 40px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <h4 style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Sub-Tags / Sections</h4>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                            {cat.subTags?.map((tag: any) => (
                                                                <span
                                                                    key={tag.id}
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '5px',
                                                                        padding: '4px 10px',
                                                                        background: 'white',
                                                                        border: '1px solid #e2e8f0',
                                                                        borderRadius: '4px',
                                                                        fontSize: '0.85rem'
                                                                    }}
                                                                >
                                                                    {tag.name}
                                                                    <button
                                                                        onClick={() => handleDeleteSubTag(tag.id)}
                                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <input
                                                                    type="text"
                                                                    value={newSubTagName[cat.id] || ''}
                                                                    onChange={e => setNewSubTagName(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                                                    placeholder="New Sub-Tag..."
                                                                    style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.85rem' }}
                                                                />
                                                                <button
                                                                    onClick={() => handleAddSubTag(cat.id)}
                                                                    style={{ background: '#d91b2b', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                            No categories found.
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
