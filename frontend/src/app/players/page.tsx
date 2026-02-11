'use client';

import { useEffect, useState } from 'react';
import { fetchRankings } from '@/lib/api';
import styles from './players.module.css';

export default function PlayersPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchRankings();
                setCategories(data);
                if (data.length > 0) {
                    setActiveCategoryId(data[0].id);
                }
            } catch (err) {
                console.error('Error loading players:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const activeCategory = categories.find(c => c.id === activeCategoryId);

    if (loading) {
        return <div className={styles.loading}>Loading PGA Tour Players...</div>;
    }

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>PGA Tour Players</h1>
                <p className={styles.subtitle}>PLAYER PERFORMANCE & PROFILES</p>
            </div>

            <div className={styles.tabs}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`${styles.tab} ${activeCategoryId === cat.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveCategoryId(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className={styles.rankingsGrid}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>RANK</th>
                            <th>PLAYER</th>
                            <th style={{ textAlign: 'right' }}>{activeCategory?.name?.toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeCategory?.leaders?.map((leader: any) => (
                            <tr key={leader.athlete.id}>
                                <td className={styles.rankCell}>{leader.rank}</td>
                                <td className={styles.playerCell}>
                                    <a
                                        href={`/players/${leader.athlete.id}`}
                                        className={styles.playerLink}
                                        title="View Player Profile"
                                    >
                                        <img
                                            src={leader.athlete.image || 'https://a.espncdn.com/i/headshots/nophoto.png'}
                                            alt={leader.athlete.name}
                                            className={styles.avatar}
                                        />
                                        <span className={styles.playerName}>{leader.athlete.name}</span>
                                    </a>
                                </td>
                                <td className={styles.valueCell}>{leader.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
