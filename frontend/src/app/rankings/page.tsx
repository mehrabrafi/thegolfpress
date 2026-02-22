'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchRankings } from '@/lib/api';
import styles from './rankings.module.css';
import Loading from '@/components/Loading';

export default function RankingsPage() {
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
                console.error('Error loading rankings:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const activeCategory = categories.find(c => c.id === activeCategoryId);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>PGA Tour Rankings</h1>
                <p className={styles.subtitle}>2026 SEASON STATISTICS</p>
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
                        {activeCategory?.leaders?.map((leader: any) => {
                            return (
                                <tr key={leader.athlete.id}>
                                    <td className={styles.rankCell}>{leader.rank}</td>
                                    <td className={styles.playerCell}>
                                        <a
                                            href={`/players/${leader.athlete.id}`}
                                            className={styles.playerLink}
                                            title="View Player Profile"
                                        >
                                            <img
                                                src={leader.athlete.image || 'https://avatar.iran.liara.run/public'}
                                                alt={leader.athlete.name}
                                                width={40}
                                                height={40}
                                                className={styles.avatar}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.athlete.name)}&background=f1f1f1&color=ed3e49&bold=true&font-size=0.33`;
                                                }}
                                            />
                                            <span className={styles.playerName}>{leader.athlete.name}</span>
                                        </a>
                                    </td>
                                    <td className={styles.valueCell}>{leader.value}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
