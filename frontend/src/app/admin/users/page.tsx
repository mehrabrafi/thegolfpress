'use client';

import { useState, useEffect } from 'react';
import { fetchUsers, updateUserRole } from '@/lib/api';
import styles from './users.module.css';
import { Mail, Calendar, Shield, User as UserIcon, Search, MoreVertical } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const data = await fetchUsers(token);
            setUsers(data);
        } catch (error) {
            console.error('Error loading users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await updateUserRole(userId, newRole, token);
            loadUsers();
        } catch (error) {
            console.error('Error updating role', error);
            alert('Failed to update role');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className={styles.loading}>Accessing User Records...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>User Management</h1>
                    <p>Govern platform access and assign administrative roles.</p>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Filter by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.userCount}>
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Identity</th>
                            <th>Email Address</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div className={styles.userName}>
                                        <div className={styles.avatar}>
                                            {u.name?.[0]?.toUpperCase() || <UserIcon size={14} />}
                                        </div>
                                        {u.name || <span className={styles.unnamed}>Unnamed Account</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.userEmail}>
                                        <Mail size={14} />
                                        {u.email}
                                    </div>
                                </td>
                                <td>
                                    <select
                                        className={`${styles.roleSelect} ${styles[u.role.toLowerCase()]}`}
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    >
                                        <option value="USER">User</option>
                                        <option value="EDITOR">Editor</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                </td>
                                <td>
                                    <div className={styles.joinDate}>
                                        <Calendar size={14} />
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <button className={styles.actionBtn}>
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
