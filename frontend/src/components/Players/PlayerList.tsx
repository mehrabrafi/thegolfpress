'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAllPlayers } from '@/lib/api';
import styles from './PlayerList.module.css';

export default function PlayerList({ limit, hideHeader = false }: { limit?: number; hideHeader?: boolean }) {
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlayers();
    }, [limit]);

    const loadPlayers = async () => {
        try {
            const data = await fetchAllPlayers();
            setPlayers(limit ? data.slice(0, limit) : data);
        } catch (error) {
            console.error('Failed to load players:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null; // or a skeleton loader
    if (!players || players.length === 0) return null;

    return (
        <div id="players" className={styles.playerContainer}>
            {!hideHeader && (
                <div className={styles.header}>
                    <h2 className={styles.title}>FOLLOW YOUR PLAYERS</h2>
                    <Link href="/players" className={styles.myFeedBtn}>
                        See All
                    </Link>
                </div>
            )}

            <div className={styles.playerGrid}>
                {players.map((player) => (
                    <Link key={player.id} href={`/players/${player.id}`} className={styles.playerCard}>
                        <img
                            src={player.image || 'https://avatar.iran.liara.run/public'}
                            alt={player.name}
                            className={styles.avatar}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=f1f1f1&color=ed3e49&bold=true&font-size=0.33`;
                            }}
                        />
                        <h3 className={styles.playerName}>{player.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}
