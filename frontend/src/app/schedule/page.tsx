'use client';

import { useEffect, useState } from 'react';
import { fetchSchedule } from '@/lib/api';
import styles from './schedule.module.css';

export default function SchedulePage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchSchedule();
                setEvents(data);
            } catch (err) {
                console.error('Error loading schedule:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading PGA Tour Schedule...</div>;
    }

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>2026 PGA Tour Schedule</h1>
                    <p className={styles.subtitle}>OFFICIAL SEASON CALENDAR</p>
                </div>
            </div>

            <div className={styles.scheduleGrid}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>TOURNAMENT</th>
                            <th>LOCATION</th>
                            <th>STATUS</th>
                            <th>PURSE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td className={styles.dateCell}>
                                    {event.displayDate}
                                </td>
                                <td>
                                    <div className={styles.nameCell}>{event.name}</div>
                                </td>
                                <td>
                                    <div className={styles.location}>{event.location}</div>
                                </td>
                                <td>
                                    <span className={`
                                        ${styles.statusIndicator} 
                                        ${event.status === 'COMPLETED' ? styles.completed :
                                            event.status === 'LIVE' ? styles.live : styles.upcoming}
                                    `}>
                                        {event.status}
                                    </span>
                                </td>
                                <td>{event.purse}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
