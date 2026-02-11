import styles from './Upcoming.module.css';

interface Event {
    date: string;
    month: string;
    name: string;
    location: string;
    purse: string;
}

export default function Upcoming({ events }: { events: Event[] }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3><span className={styles.icon}>📅</span> Upcoming</h3>
            </div>
            <div className={styles.eventList}>
                {events.slice(0, 3).map((event, idx) => (
                    <div key={idx} className={styles.eventItem}>
                        <div className={styles.dateBox}>
                            <span className={styles.month}>{event.month}</span>
                            <span className={styles.day}>{event.date}</span>
                        </div>
                        <div className={styles.eventInfo}>
                            <div className={styles.name}>{event.name}</div>
                            <div className={styles.location}>📍 {event.location}</div>
                            <div className={styles.purse}>Purse: {event.purse}</div>
                        </div>
                    </div>
                ))}
            </div>
            <a href="/schedule" className={styles.viewAllBtn}>
                VIEW ALL TOURNAMENTS <span>→</span>
            </a>
        </div>
    );
}
