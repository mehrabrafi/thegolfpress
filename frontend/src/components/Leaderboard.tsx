import Link from 'next/link';
import styles from './Leaderboard.module.css';

interface Player {
    id: string;
    position: string;
    name: string;
    score: string;
    thru: string;
    image: string;
    country: string;
}

export default function Leaderboard({ players }: { players: Player[] }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3><span className={styles.icon}>📊</span> Leaderboard</h3>
                <span className={styles.liveTag}>● LIVE</span>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>POS</th>
                        <th>PLAYER</th>
                        <th>SCORE</th>
                        <th>THRU</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((p, idx) => (
                        <tr key={idx}>
                            <td>{p.position}</td>
                            <td className={styles.playerCell}>
                                <Link
                                    href={`/players/${p.id}`}
                                    className={styles.playerLink}
                                    title="View Player Profile"
                                >
                                    <img src={p.image} alt={p.name} className={styles.avatar} />
                                    <div>
                                        <div className={styles.playerName}>{p.name}</div>
                                        <div className={styles.playerCountry}>
                                            <img src={p.country} alt={`${p.name} country flag`} className={styles.miniFlag} />
                                        </div>
                                    </div>
                                </Link>
                            </td>
                            <td className={p.score.startsWith('-') ? styles.scoreMinus : ''}>{p.score}</td>
                            <td>{p.thru}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link href="/scores" className={styles.viewMore}>VIEW FULL LEADERBOARD</Link>
        </div>
    );
}
