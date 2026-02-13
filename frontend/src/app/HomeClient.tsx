'use client';

import { useEffect, useState } from 'react';
import LiveFeed from '@/components/LiveFeed';
import Hero from '@/components/Hero';
import SubNews from '@/components/SubNews';
import SidebarNews from '@/components/SidebarNews';
import Leaderboard from '@/components/Leaderboard';
import DynamicSection from '@/components/DynamicSection';
import JsonLd, { createWebsiteJsonLd } from '@/components/JsonLd';
import { fetchLeaderboard, fetchNews, fetchHomeSections, fetchTrendingNews } from '@/lib/api';
import styles from './page.module.css';

interface HomeClientProps {
    initialNews: any[] | null;
    initialTrending: any[] | null;
    initialLeaderboard: any | null;
    initialSections: any[];
    initialSectionArticles: { [key: string]: any[] };
}

export default function HomeClient({
    initialNews,
    initialTrending,
    initialLeaderboard,
    initialSections,
    initialSectionArticles,
}: HomeClientProps) {
    const [lbData, setLbData] = useState<any>(initialLeaderboard);
    const [news, setNews] = useState<any[] | null>(initialNews);
    const [trendingNews, setTrendingNews] = useState<any[] | null>(initialTrending);
    const [homeSections] = useState<any[]>(initialSections);
    const [sectionArticles] = useState<{ [key: string]: any[] }>(initialSectionArticles);

    // Refresh live data client-side (leaderboard updates frequently)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchLeaderboard()
                .then(data => setLbData(data))
                .catch(err => console.error('Error refreshing leaderboard:', err));
        }, 60000); // Refresh every 60 seconds

        return () => clearInterval(interval);
    }, []);

    const feedPlayers = lbData?.players?.slice(0, 10) || [];
    const leaderboardPlayers = lbData?.players?.slice(0, 7) || [];

    // Distribute news if available
    const heroArticle = news && news.length > 0 ? news[0] : null;
    const subArticles = news && news.length > 1 ? news.slice(1, 7) : [];
    const sidebarArticles = trendingNews || [];

    return (
        <main>
            <JsonLd data={createWebsiteJsonLd()} />
            {/* Live Feed */}
            {lbData ? (
                <LiveFeed players={feedPlayers} />
            ) : (
                <div className={styles.skeleton} style={{ padding: '20px' }}>Loading Live Feed...</div>
            )}

            <div className="container">
                <div className={styles.mainGrid}>
                    <div className={styles.leftCol}>
                        {/* Hero & SubNews */}
                        {news ? (
                            <>
                                {heroArticle && <Hero article={heroArticle} />}
                                {subArticles.length > 0 && <SubNews articles={subArticles} />}
                            </>
                        ) : (
                            <div className={styles.skeleton} style={{ height: '400px' }}>
                                Loading News...
                            </div>
                        )}
                    </div>

                    <div className={styles.rightCol}>
                        {/* Leaderboard */}
                        {lbData ? (
                            <Leaderboard players={leaderboardPlayers} />
                        ) : (
                            <div className={styles.skeleton} style={{ height: '300px' }}>
                                Loading Leaderboard...
                            </div>
                        )}

                        {/* Sidebar News */}
                        {sidebarArticles.length > 0 && <SidebarNews articles={sidebarArticles} />}
                    </div>
                </div>

                {/* Dynamic Sections */}
                {homeSections.map((section) => (
                    <DynamicSection
                        key={section.id}
                        title={section.title}
                        articles={sectionArticles[section.id] || []}
                        link={section.link}
                        linkText={section.linkText}
                    />
                ))}
            </div>
        </main>
    );
}
