'use client';

import { useState, useEffect } from 'react';
import { fetchContentAnalytics } from '@/lib/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, AreaChart, Area, Legend
} from 'recharts';
import { Eye, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import styles from './page.module.css';

// Color palette for the pie/bar charts
const COLORS = ['#d91b2b', '#2563eb', '#16a34a', '#ca8a04', '#7c3aed', '#0891b2', '#db2777', '#ea580c', '#4f46e5', '#059669'];

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
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
                <p key={i} style={{ color: p.color || '#64748b', fontSize: '0.88rem', margin: 0 }}>
                    {p.name}: <strong>{p.value?.toLocaleString()}</strong>
                </p>
            ))}
        </div>
    );
};

// Pie label renderer
const renderPieLabel = ({ name, percent }: any) => {
    if (percent < 0.05) return null;
    return `${name} (${(percent * 100).toFixed(0)}%)`;
};

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchContentAnalytics();
                setData(res);
            } catch (err: any) {
                setError(err.message || 'Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span className={styles.loadingText}>Loading analytics data...</span>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>⚠️ {error}</div>;
    }

    const maxViews = data.topArticles?.[0]?.views || 1;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Content Analytics</h1>
                <p className={styles.subtitle}>
                    Understand audience interest across categories, tags, and individual articles.
                </p>
            </div>

            {/* Metric Cards */}
            <div className={styles.metricsRow}>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Total Views</div>
                    <p className={styles.metricValue}>{data.totalViews?.toLocaleString()}</p>
                    <div className={styles.metricSub}>Across all published content</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Total Articles</div>
                    <p className={styles.metricValue}>{data.totalArticles?.toLocaleString()}</p>
                    <div className={styles.metricSub}>Published articles</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Avg. Views / Article</div>
                    <p className={styles.metricValue}>{data.avgViewsPerArticle?.toLocaleString()}</p>
                    <div className={styles.metricSub}>Average engagement</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Categories</div>
                    <p className={styles.metricValue}>{data.viewsByCategory?.length || 0}</p>
                    <div className={styles.metricSub}>Active categories</div>
                </div>
            </div>

            {/* Charts Row 1: Views by Category (bar) + Type Distribution (pie) */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Views by Category</h2>
                        <span className={styles.chartBadge}>All Time</span>
                    </div>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.viewsByCategory || []} layout="vertical" margin={{ left: 10, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    width={120}
                                    tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="views" radius={[0, 6, 6, 0]} name="Views">
                                    {(data.viewsByCategory || []).map((_: any, i: number) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Content Type Distribution</h2>
                        <span className={styles.chartBadge}>By Views</span>
                    </div>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data.viewsByType || []}
                                    dataKey="views"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    innerRadius={55}
                                    paddingAngle={3}
                                    label={renderPieLabel}
                                    labelLine={false}
                                >
                                    {(data.viewsByType || []).map((_: any, i: number) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(val: string) => <span style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 600 }}>{val}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Publishing Trend (area, full width) */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCardWide}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Publishing Activity & Views (Last 30 Days)</h2>
                        <span className={styles.chartBadge}>30-day Trend</span>
                    </div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <AreaChart data={data.publishTrend || []}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d91b2b" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#d91b2b" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    interval={4}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(val: string) => <span style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 600 }}>{val}</span>}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    name="Views"
                                    stroke="#d91b2b"
                                    strokeWidth={2}
                                    fill="url(#colorViews)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    name="Articles Published"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    fill="url(#colorArticles)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tag Performance Cloud */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCardWide}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Tag Performance</h2>
                        <span className={styles.chartBadge}>Top 15 Tags</span>
                    </div>
                    <div className={styles.tagGrid}>
                        {(data.viewsByTag || []).map((tag: any, i: number) => (
                            <div key={i} className={styles.tagItem}>
                                <span className={styles.tagName}>{tag.name}</span>
                                <span className={styles.tagViews}>
                                    {tag.views.toLocaleString()} views · {tag.articles} articles
                                </span>
                            </div>
                        ))}
                        {(!data.viewsByTag || data.viewsByTag.length === 0) && (
                            <p style={{ color: '#94a3b8' }}>No tag data available yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Articles Table */}
            <div className={styles.chartsGrid}>
                <div className={styles.topArticlesCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Top Performing Articles</h2>
                        <span className={styles.chartBadge}>Top 10</span>
                    </div>
                    <table className={styles.articleTable}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Article</th>
                                <th>Category</th>
                                <th>Views</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.topArticles || []).map((article: any, idx: number) => (
                                <tr key={article.id}>
                                    <td>
                                        <span className={`${styles.rankBadge} ${idx === 0 ? styles.rankGold : idx === 1 ? styles.rankSilver : idx === 2 ? styles.rankBronze : styles.rankDefault}`}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className={styles.articleTitle}>{article.title}</td>
                                    <td>
                                        <span className={styles.articleCategory}>{article.category}</span>
                                    </td>
                                    <td>
                                        <div className={styles.viewsBar}>
                                            <span className={styles.articleViews}>
                                                {article.views.toLocaleString()}
                                            </span>
                                            <div className={styles.viewsBarTrack}>
                                                <div
                                                    className={styles.viewsBarFill}
                                                    style={{ width: `${Math.max((article.views / maxViews) * 100, 5)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!data.topArticles || data.topArticles.length === 0) && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>
                                        No article data available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
