'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchAllPlayers } from '@/lib/api';
import PlayerList from '@/components/Players/PlayerList';
import Loading from '@/components/Loading';
import styles from './players.module.css';

export default function PlayersPage() {
    const [players, setPlayers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchAllPlayers();
                setPlayers(data);
            } catch (err) {
                console.error('Error loading players:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <Loading />;

    return (
        <div className={`container ${styles.container}`}>

            <div className={styles.header}>
                <h2 className={styles.title}>Discover Professional Golfers</h2>
                <p className={styles.subtitle}>EXPLORE CAREER STATS, RANKINGS & PERFORMANCE</p>
            </div>

            <div className={styles.rankingsGrid}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>PLAYER</th>
                            <th style={{ textAlign: 'right' }}>PROFILE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.map((player: any) => (
                            <tr key={player.id}>
                                <td className={styles.playerCell}>
                                    <a
                                        href={`/players/${player.id}`}
                                        className={styles.playerLink}
                                        title="View Player Profile"
                                    >
                                        <img
                                            src={player.image || 'https://avatar.iran.liara.run/public'}
                                            alt={player.name}
                                            width={50}
                                            height={50}
                                            className={styles.avatar}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=f1f1f1&color=ed3e49&bold=true&font-size=0.33`;
                                            }}
                                        />
                                        <span className={styles.playerName}>{player.name}</span>
                                    </a>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <a href={`/players/${player.id}`} className={styles.tab} style={{ fontSize: '0.75rem', padding: '5px 15px' }}>
                                        VIEW PROFILE
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredPlayers.length === 0 && (
                <div className={styles.loading}>
                    {searchQuery ? `No players matching "${searchQuery}"` : "No players found in the database."}
                </div>
            )}
        </div>
    );
}
