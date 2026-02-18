'use client';

import { useState, useEffect } from 'react';
import { fetchAllHomeSections, createHomeSection, updateHomeSection, deleteHomeSection, fetchCategories } from '@/lib/api';
import styles from './home-sections.module.css';

export default function HomeSectionsPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        order: 0,
        active: true,
        link: '',
        linkText: '',
        maxItems: 4
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [sects, cats] = await Promise.all([
                fetchAllHomeSections(),
                fetchCategories()
            ]);
            setSections(sects);
            setCategories(cats);
        } catch (error) {
            console.error('Error loading home sections data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (section: any) => {
        setEditingSection(section);
        setFormData({
            title: section.title,
            category: section.category,
            order: section.order,
            active: section.active,
            link: section.link || '',
            linkText: section.linkText || '',
            maxItems: section.maxItems
        });
    };

    const handleCancel = () => {
        setEditingSection(null);
        setFormData({
            title: '',
            category: '',
            order: 0,
            active: true,
            link: '',
            linkText: '',
            maxItems: 4
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSection) {
                await updateHomeSection(editingSection.id, formData);
            } else {
                await createHomeSection(formData);
            }
            handleCancel();
            loadData();
        } catch (error) {
            console.error('Error saving home section:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this section?')) {
            try {
                await deleteHomeSection(id);
                loadData();
            } catch (error) {
                console.error('Error deleting home section:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Manage Home Sections</h1>

            <div className={styles.grid}>
                <div className={styles.formCard}>
                    <h2 className={styles.cardTitle}>{editingSection ? 'Edit Section' : 'Add New Section'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g. Featured Courses"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Category (Filter)</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name.toUpperCase()}>{cat.name}</option>
                                ))}
                                <option value="GUIDES-TIPS">GUIDES-TIPS (Legacy)</option>
                                <option value="COURSES">COURSES (Legacy)</option>
                                <option value="EQUIPMENT">EQUIPMENT</option>
                                <option value="BREAKING">BREAKING</option>
                            </select>
                            {formData.category && (
                                <p className={styles.categoryNote}>
                                    Checking articles... (Make sure this matches your News category)
                                </p>
                            )}
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Order (Sorting)</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Max Items to Show</label>
                                <input
                                    type="number"
                                    value={formData.maxItems}
                                    onChange={(e) => setFormData({ ...formData, maxItems: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Link (Optional)</label>
                            <input
                                type="text"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="/courses"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Link Text (Optional)</label>
                            <input
                                type="text"
                                value={formData.linkText}
                                onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                                placeholder="VIEW ALL COURSES →"
                            />
                        </div>
                        <div className={styles.formGroupCheckbox}>
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                            <label htmlFor="active">Active</label>
                        </div>
                        <div className={styles.formActions}>
                            <button type="submit" className={styles.submitBtn}>
                                {editingSection ? 'Update Section' : 'Create Section'}
                            </button>
                            {editingSection && (
                                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className={styles.listCard}>
                    <h2 className={styles.cardTitle}>Existing Sections</h2>
                    <div className={styles.list}>
                        {sections.length === 0 ? (
                            <p>No sections found.</p>
                        ) : (
                            sections.map((section) => (
                                <div key={section.id} className={`${styles.listItem} ${!section.active ? styles.inactive : ''}`}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemOrder}>#{section.order}</span>
                                        <div className={styles.itemMain}>
                                            <h3 className={styles.itemTitle}>{section.title}</h3>
                                            <span className={styles.itemSubtitle}>{section.category} • {section.maxItems} items</span>
                                        </div>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <button onClick={() => handleEdit(section)} className={styles.editBtn}>Edit</button>
                                        <button onClick={() => handleDelete(section.id)} className={styles.deleteBtn}>Delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
