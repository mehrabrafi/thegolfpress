import styles from './LiveFeed.module.css';

interface PlayerScore {
    name: string;
    score: string;
    thru: string;
}

export default function LiveFeed({ players }: { players: PlayerScore[] }) {
    return (
        <div className={styles.liveFeed}>
            <div className={`container ${styles.feedContent}`}>
                <div className={styles.labelWrapper}>
                    <span className={styles.label}>LIVE FEED:</span>
                </div>
                <div className={styles.tickerWrapper}>
                    <div className={styles.ticker}>
                        {players.concat(players).map((player, idx) => (
                            <div key={idx} className={styles.playerItem}>
                                <span className={styles.playerName}>{player.name}</span>
                                <span className={player.score.startsWith('-') ? styles.scoreGreen : styles.scoreRed}>
                                    {player.score} ({player.thru})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
