'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchAdminStats, fetchSystemHealth } from '@/lib/api';
import styles from './page.module.css';
import { Users, FileText, CheckCircle, Activity, BarChart3, Shield, Database, Server, Wifi, Cpu } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// Custom Tooltip for bar chart
const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#fff',
            border: 'none',
            borderRadius: 12,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
            padding: '12px 16px',
        }}>
            <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
                    Visitors: <strong style={{ color: '#d91b2b' }}>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

// 7 distinct colors for each day of the week
const BAR_COLORS = ['#d91b2b', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2', '#db2777'];


export default function AdminPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState<any>(null);
    const [healthLoading, setHealthLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchAdminStats();
                setStats(data);
            } catch (error) {
                console.error('Error loading stats', error);
            } finally {
                setLoading(false);
            }
        };
        const loadHealth = async () => {
            try {
                const data = await fetchSystemHealth();
                setHealth(data);
            } catch (error) {
                console.error('Error loading health', error);
            } finally {
                setHealthLoading(false);
            }
        };
        loadStats();
        loadHealth();
    }, []);

    const activityData = stats?.activityGraph || [];

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header}>
                <h1 className={styles.welcome}>Administration Overview</h1>
                <p className={styles.subtext}>Greetings, {user?.name}. Here's the pulse of your platform today.</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.users}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Audience</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.totalUsers || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.dau}`}>
                        <Activity size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Daily Active Users</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.dau || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.posts}`}>
                        <FileText size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Editorial Pieces</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.totalPosts || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.published}`}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Live Content</span>
                        <p className={styles.statValue}>{loading ? '...' : stats?.publishedPosts || 0}</p>
                    </div>
                </div>
            </div>

            {/* 7-Day Visitor Activity Bar Chart */}
            <div className={styles.chartSection}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitleRow}>
                            <div className={`${styles.iconWrapper} ${styles.chartIcon}`}>
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h2 className={styles.chartTitle}>7-Day Visitor Activity</h2>
                                <p className={styles.chartSubtitle}>Unique visitors per day over the last week</p>
                            </div>
                        </div>
                        <span className={styles.chartBadge}>Last 7 Days</span>
                    </div>
                    <div className={styles.chartBody}>
                        {loading ? (
                            <div className={styles.chartLoading}>Loading chart...</div>
                        ) : activityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#d91b2b" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#d91b2b" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(217,27,43,0.05)', radius: 8 }} />
                                    <Bar dataKey="count" name="Visitors" radius={[8, 8, 4, 4]} barSize={36}>
                                        {activityData.map((_: any, i: number) => (
                                            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className={styles.chartEmpty}>No visitor data available yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* System Health / Server Status */}
            <div className={styles.healthSection}>
                <div className={styles.healthCard}>
                    <div className={styles.healthHeader}>
                        <div className={styles.chartTitleRow}>
                            <div className={`${styles.iconWrapper} ${styles.healthIcon}`}>
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className={styles.chartTitle}>System Health</h2>
                                <p className={styles.chartSubtitle}>
                                    {healthLoading ? 'Checking services...' : `Server uptime: ${health?.uptime || '—'}`}
                                </p>
                            </div>
                        </div>
                        {!healthLoading && health && (
                            <span className={`${styles.overallBadge} ${styles[`overall_${health.overall}`]}`}>
                                <span className={styles.pulsingDot} />
                                {health.overall === 'operational' ? 'All Systems Operational' :
                                    health.overall === 'degraded' ? 'Partial Degradation' : 'System Outage'}
                            </span>
                        )}
                    </div>
                    <div className={styles.healthBody}>
                        {healthLoading ? (
                            <div className={styles.chartLoading}>Checking system health...</div>
                        ) : health?.services ? (
                            <div className={styles.servicesGrid}>
                                {health.services.map((svc: any, i: number) => {
                                    const iconMap: Record<string, any> = {
                                        'Database': <Database size={18} />,
                                        'API Server': <Server size={18} />,
                                        'ESPN Data Feed': <Wifi size={18} />,
                                        'Memory': <Cpu size={18} />,
                                    };
                                    return (
                                        <div key={i} className={styles.serviceItem}>
                                            <div className={styles.serviceLeft}>
                                                <div className={`${styles.serviceIcon} ${styles[`svc_${svc.status}`]}`}>
                                                    {iconMap[svc.name] || <Server size={18} />}
                                                </div>
                                                <div>
                                                    <span className={styles.serviceName}>{svc.name}</span>
                                                    <span className={styles.serviceDetails}>{svc.details}</span>
                                                </div>
                                            </div>
                                            <div className={styles.serviceRight}>
                                                {svc.responseTime !== undefined && svc.responseTime > 0 && (
                                                    <span className={styles.responseTime}>{svc.responseTime}ms</span>
                                                )}
                                                <span className={`${styles.statusDot} ${styles[`dot_${svc.status}`]}`} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={styles.chartEmpty}>Unable to check system health.</div>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}
