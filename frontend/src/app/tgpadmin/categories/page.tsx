'use client';

import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, fetchSubTags, createSubTag, deleteSubTag } from '@/lib/api';
import styles from '@/app/tgpadmin/news/news.module.css';
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
    const [newSubTagImage, setNewSubTagImage] = useState<Record<string, string>>({});

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
        const image = newSubTagImage[categoryId] || '';
        if (!name) return;

        try {
            await createSubTag({ name, categoryId, image });
            setNewSubTagName(prev => ({ ...prev, [categoryId]: '' }));
            setNewSubTagImage(prev => ({ ...prev, [categoryId]: '' }));
            loadData();
        } catch (error) {
            console.error('Error adding sub-tag', error);
        }
    };

    const handleDeleteSubTag = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sub-tag?')) return;
        try {
            await deleteSubTag(id);
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
            await deleteCategory(id);
            loadData();
        } catch (error) {
            console.error('Error deleting category', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateCategory(editId, formData);
            } else {
                await createCategory(formData);
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
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-start' }}>
                                                            {cat.subTags?.map((tag: any) => (
                                                                <div
                                                                    key={tag.id}
                                                                    style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        gap: '8px',
                                                                        padding: '10px',
                                                                        background: 'white',
                                                                        border: '1px solid #e2e8f0',
                                                                        borderRadius: '8px',
                                                                        width: '180px',
                                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                                    }}
                                                                >
                                                                    {tag.image && (
                                                                        <img
                                                                            src={tag.image}
                                                                            alt={tag.name}
                                                                            style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                                                        />
                                                                    )}
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{tag.name}</span>
                                                                        <button
                                                                            onClick={() => handleDeleteSubTag(tag.id)}
                                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* Dynamic Add Form */}
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '10px',
                                                                padding: '15px',
                                                                background: 'white',
                                                                border: '2px dashed #e2e8f0',
                                                                borderRadius: '8px',
                                                                width: '240px'
                                                            }}>
                                                                <h5 style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>ADD NEW SECTION</h5>
                                                                <input
                                                                    type="text"
                                                                    value={newSubTagName[cat.id] || ''}
                                                                    onChange={e => setNewSubTagName(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                                                    placeholder="Section Name (e.g. Drivers)"
                                                                    style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.8rem' }}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={newSubTagImage[cat.id] || ''}
                                                                    onChange={e => setNewSubTagImage(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                                                    placeholder="Image URL..."
                                                                    style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.8rem' }}
                                                                />
                                                                <button
                                                                    onClick={() => handleAddSubTag(cat.id)}
                                                                    style={{ background: '#d91b2b', color: 'white', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                                >
                                                                    Create Section
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
