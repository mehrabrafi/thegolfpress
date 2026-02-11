'use client';

import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '@/lib/api';
import styles from './scores.module.css';

export default function ScoresPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const lb = await fetchLeaderboard();
                setData(lb);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className={styles.loading}>Loading Full Leaderboard...</div>;

    return (
        <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{data?.tournamentName || 'Leaderboard'}</h1>
                    <p className={styles.subtitle}>PGA TOUR | FINAL ROUND</p>
                </div>
                <div className={styles.status}>
                    <span className={styles.dot}></span> LIVE
                </div>
            </div>

            <div className={styles.scoreGrid}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>POS</th>
                            <th>PLAYER</th>
                            <th>SCORE</th>
                            <th>THRU</th>
                            <th>TODAY</th>
                            <th>R1</th>
                            <th>R2</th>
                            <th>R3</th>
                            <th>R4</th>
                            <th>TOT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.players?.map((p: any, idx: number) => (
                            <tr key={idx}>
                                <td className={styles.posCell}>{p.position}</td>
                                <td className={styles.playerCell}>
                                    <a
                                        href={`/players/${p.id}`}
                                        className={styles.playerLink}
                                        title="View Player Profile"
                                    >
                                        <img src={p.image || 'https://via.placeholder.com/40'} alt={p.name} className={styles.avatar} />
                                        <div>
                                            <div className={styles.pName}>{p.name}</div>
                                            <div className={styles.pCountry}>
                                                <img src={p.country} alt="flag" className={styles.flag} />
                                                {p.countryName}
                                            </div>
                                        </div>
                                    </a>
                                </td>
                                <td className={p.score?.startsWith('-') ? styles.scoreMinus : styles.scorePlus}>
                                    {p.score}
                                </td>
                                <td>{p.thru}</td>
                                <td className={p.today?.startsWith('-') ? styles.scoreMinus : ''}>{p.today}</td>
                                <td>{p.rounds[0]}</td>
                                <td>{p.rounds[1]}</td>
                                <td>{p.rounds[2]}</td>
                                <td>{p.rounds[3]}</td>
                                <td>{p.totalStrokes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
