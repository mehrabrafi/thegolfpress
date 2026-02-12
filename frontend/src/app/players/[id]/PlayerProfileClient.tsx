'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPlayerProfile } from '@/lib/api';
import styles from './player-profile.module.css';
import PerformanceChart from './PerformanceChart';
import { Twitter, Instagram, Globe, GraduationCap, Award } from 'lucide-react';

export default function PlayerProfileClient({ id }: { id: string }) {
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('PlayerProfileClient mounted with ID:', id);

        if (!id || id === 'undefined') {
            setLoading(false);
            return;
        }

        async function load() {
            setLoading(true);
            try {
                console.log('Calling fetchPlayerProfile for:', id);
                const data = await fetchPlayerProfile(id);
                console.log('Successfully fetched player data:', data);
                setPlayer(data);
            } catch (err) {
                console.error('Failed to load athlete profile:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <div className={styles.loading}>Loading Athlete Profile...</div>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="container">
                <div className={styles.loading}>Player not found or error loading profile.</div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.profileContainer}`}>
            {/* Athlete Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Athlete",
                        "name": player.name,
                        "description": player.description || `${player.name} is a professional golfer on the PGA TOUR.`,
                        "image": player.image,
                        "url": `https://yourgolfwire.com/players/${id}`,
                        "nationality": {
                            "@type": "Country",
                            "name": player.citizenship || player.country?.name
                        },
                        "memberOf": [
                            {
                                "@type": "SportsOrganization",
                                "name": "PGA TOUR"
                            }
                        ],
                        "college": player.collegeName
                    })
                }}
            />

            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.imageWrapper}>
                    <img
                        src={player.image || 'https://a.espncdn.com/i/headshots/nophoto.png'}
                        alt={player.name}
                        className={styles.playerImage}
                    />
                </div>
                <div className={styles.playerInfo}>
                    <h1>{player.name}</h1>
                    <div className={styles.heroMeta}>
                        <div className={styles.countryTag}>
                            {player.citizenship || player.country?.abbreviation || 'PGA TOUR'}
                        </div>
                        {player.collegeName && (
                            <div className={styles.bioBadge}>
                                <GraduationCap size={16} />
                                <span>{player.collegeName}</span>
                            </div>
                        )}
                        {player.turnedPro && (
                            <div className={styles.bioBadge}>
                                <Award size={16} />
                                <span>Turned Pro: {player.turnedPro}</span>
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className={styles.socialLinks}>
                        {player.links?.filter((l: any) => l.rel?.includes('twitter') || l.rel?.includes('instagram') || l.text?.toLowerCase().includes('twitter') || l.text?.toLowerCase().includes('instagram')).map((link: any, idx: number) => (
                            <a
                                key={idx}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialIcon}
                                title={link.text}
                            >
                                {link.text?.toLowerCase().includes('twitter') ? <Twitter size={20} /> :
                                    link.text?.toLowerCase().includes('instagram') ? <Instagram size={20} /> :
                                        <Globe size={20} />}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Career Snapshot */}
            <div className={styles.careerSnapshot}>
                <div className={styles.careerCard}>
                    <div className={styles.careerLabel}>Career Wins</div>
                    <div className={styles.careerValue}>{player.careerTotals?.wins || 0}</div>
                    <div className={styles.careerSubText}>PGA TOUR VICTORIES</div>
                </div>
                <div className={styles.careerCard}>
                    <div className={styles.careerLabel}>Cuts Made</div>
                    <div className={styles.careerValue}>{player.careerTotals?.cutsMade || 0}</div>
                    <div className={styles.careerSubText}>ACROSS ALL SEASONS</div>
                </div>
                <div className={styles.careerCard}>
                    <div className={styles.careerLabel}>Career Earnings</div>
                    <div className={styles.careerValue}>
                        {player.careerTotals?.earnings ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(player.careerTotals.earnings) : '$0'}
                    </div>
                    <div className={styles.careerSubText}>OFFICIAL PRIZE MONEY</div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Age</div>
                    <div className={styles.statValue}>{player.age || '--'}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Turned Pro</div>
                    <div className={styles.statValue}>{player.turnedPro || '--'}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Height</div>
                    <div className={styles.statValue}>{player.height || '--'}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Weight</div>
                    <div className={styles.statValue}>{player.weight || '--'}</div>
                </div>
            </div>

            {/* Detailed Info */}
            <div className={styles.detailsSection}>
                <h2 className={styles.sectionTitle}>Biography & Career Details</h2>
                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Full Name</div>
                        <div className={styles.detailValue}>{player.fullName || player.name || 'N/A'}</div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Birth Place</div>
                        <div className={styles.detailValue}>
                            {player.birthPlace?.city ? `${player.birthPlace.city}, ` : ''}
                            {player.birthPlace?.state || player.birthPlace?.country || 'N/A'}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Date of Birth</div>
                        <div className={styles.detailValue}>
                            {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Citizenship</div>
                        <div className={styles.detailValue}>{player.citizenship || 'N/A'}</div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Gender</div>
                        <div className={styles.detailValue} style={{ textTransform: 'capitalize' }}>
                            {player.gender?.toLowerCase() || 'N/A'}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Hand</div>
                        <div className={styles.detailValue} style={{ textTransform: 'capitalize' }}>
                            {player.hand?.displayValue?.toLowerCase() || 'N/A'}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Tour Status</div>
                        <div className={styles.detailValue}>
                            <span className={player.status?.type === 'active' ? styles.statusActive : styles.statusInactive}>
                                {player.status?.name || 'Unknown'}
                            </span>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Professionalism</div>
                        <div className={styles.detailValue}>
                            {player.amateur ? 'Amateur Athlete' : 'Professional Golfer'}
                        </div>
                    </div>
                    {player.college && (
                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>College</div>
                            <div className={styles.detailValue}>University Athlete</div>
                        </div>
                    )}
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>API Linked</div>
                        <div className={styles.detailValue}>{player.linked ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            </div>

            {/* Performance Visualization */}
            {player.performanceStats && (
                <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <PerformanceChart data={player.performanceStats} playerName={player.name} />
                </div>
            )}

            {/* Upcoming Schedule */}
            {player.upcomingEvents && player.upcomingEvents.length > 0 && (
                <div className={styles.detailsSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle}>Upcoming PGA Tour Events</h2>
                    <div className={styles.scheduleGrid}>
                        {player.upcomingEvents.map((ev: any) => (
                            <div key={ev.id} className={styles.scheduleCard}>
                                <div className={styles.scheduleDate}>
                                    {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    <span> - </span>
                                    {new Date(ev.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className={styles.scheduleName}>{ev.name}</div>
                                <div className={styles.scheduleMeta}>
                                    <span>📍 {ev.location || 'TBD'}</span>
                                    <span className={styles.purseBadge}>{ev.purse !== 'TBD' ? `💰 ${ev.purse}` : 'Purse: TBD'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Results Section */}
            {player.recentResults && player.recentResults.length > 0 && (
                <div className={styles.detailsSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle}>Recent Tournament Results</h2>
                    <div className={styles.tableResponsive}>
                        <table className={styles.resultsTable}>
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>TOURNAMENT</th>
                                    <th>FINISH</th>
                                    <th>SCORE</th>
                                    <th>EARNINGS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {player.recentResults.map((res: any) => (
                                    <tr key={res.id}>
                                        <td className={styles.dateCell}>
                                            {new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className={styles.tournamentCell}>{res.name}</td>
                                        <td className={styles.rankCell}>
                                            <span className={res.rank === '1' ? styles.winnerBadge : ''}>
                                                {res.rank === '1' ? '🏆 Winner' : res.rank}
                                            </span>
                                        </td>
                                        <td className={styles.scoreCell}>{res.score}</td>
                                        <td className={styles.earningsCell}>{res.earnings}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Related News Section */}
            {player.relatedNews && player.relatedNews.length > 0 && (
                <div className={styles.detailsSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle}>Latest News for {player.name}</h2>
                    <div className={styles.newsGrid}>
                        {player.relatedNews.map((news: any) => (
                            <Link key={news.id} href={`/news/${news.id}`} className={styles.newsItem}>
                                <div className={styles.newsImageWrapper}>
                                    <img src={news.image} alt={news.title} className={styles.newsImage} />
                                </div>
                                <div className={styles.newsContent}>
                                    <div className={styles.newsCategory}>{news.category}</div>
                                    <h3 className={styles.newsTitle}>{news.title}</h3>
                                    <p className={styles.newsExcerpt}>{news.excerpt}</p>
                                    <div className={styles.newsMeta}>
                                        <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Season Statistics Section */}
            {player.seasonStats && (
                <div className={styles.detailsSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle}>2026 Season Performance</h2>
                    <div className={styles.statsSummaryGrid}>
                        {player.seasonStats.splits?.categories?.map((cat: any) => (
                            <div key={cat.name} className={styles.categoryCard}>
                                <h3 className={styles.categoryTitle}>{cat.displayName}</h3>
                                <div className={styles.categoryStatsList}>
                                    {cat.stats?.slice(0, 6).map((stat: any) => (
                                        <div key={stat.name} className={styles.statRow}>
                                            <span className={styles.statName}>{stat.displayName}</span>
                                            <span className={styles.statVal}>
                                                {stat.displayValue}
                                                {stat.rankDisplayValue && <small className={styles.rankBadge}>{stat.rankDisplayValue}</small>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
