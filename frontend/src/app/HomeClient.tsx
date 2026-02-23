'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LiveFeed from '@/components/LiveFeed';
import TopStories from '@/components/TopStories';
import JsonLd, { createWebsiteJsonLd } from '@/components/JsonLd';
import { fetchLeaderboard } from '@/lib/api';
import LatestNews from '@/components/LatestNews';
import DualColumnNews from '@/components/DualColumnNews';
import ThreeColumnImageNews from '@/components/ThreeColumnImageNews';
import EquipmentAndCoursesNews from '@/components/EquipmentAndCoursesNews';
import Leaderboard from '@/components/Leaderboard';
import styles from './page.module.css';

interface HomeClientProps {
    initialNews: any[] | null;
    initialTrending: any[] | null;
    initialLeaderboard: any | null;
    initialGuides: any[];
    initialCourses: any[];
    initialEquipment: any[];
    initialLifestyle: any[];
}

export default function HomeClient({
    initialNews,
    initialTrending,
    initialLeaderboard,
    initialGuides,
    initialCourses,
    initialEquipment,
    initialLifestyle,
}: HomeClientProps) {
    const [lbData, setLbData] = useState<any>(initialLeaderboard);
    const [news] = useState<any[] | null>(initialNews);

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

    // Distribute news for the top banners
    const initialTopArticles = [
        news && news.length > 0 ? news[0] : null,
        initialEquipment && initialEquipment.length > 0 ? initialEquipment[0] : null,
        initialGuides && initialGuides.length > 0 ? initialGuides[0] : null,
        initialCourses && initialCourses.length > 0 ? initialCourses[0] : null
    ].filter(Boolean);

    const uniqueTopArticlesMap = new Map();
    initialTopArticles.forEach(a => uniqueTopArticlesMap.set(a?.id, a));

    let newsIndex = 1;
    while (uniqueTopArticlesMap.size < 5 && news && news.length > newsIndex) {
        const nextNews = news[newsIndex];
        if (!uniqueTopArticlesMap.has(nextNews?.id)) {
            uniqueTopArticlesMap.set(nextNews.id, nextNews);
        }
        newsIndex++;
    }

    const topArticles = Array.from(uniqueTopArticlesMap.values()).slice(0, 5);
    const newsArticles = news && news.length > newsIndex ? news.slice(newsIndex, newsIndex + 10) : [];

    // Popular articles for the sidebar — use trending (viewCount-sorted) with deduplication
    const seenIds = new Set<string>();
    const popularArticlesForSidebar = (initialTrending || []).filter((article: any) => {
        if (!article?.id || seenIds.has(article.id)) return false;
        seenIds.add(article.id);
        return true;
    }).slice(0, 10);

    const lifestyleDisplay = (initialLifestyle && initialLifestyle.length > 0) ? initialLifestyle.slice(0, 10) : [];

    return (
        <>
            <h1 className="sr-only">The Golf Press — Live Scores, News & Course Reviews</h1>
            <JsonLd data={createWebsiteJsonLd()} />

            {/* Live Feed (Score Ticker) */}
            {lbData ? (
                <LiveFeed players={feedPlayers} />
            ) : (
                <div className={styles.skeleton} style={{ padding: '20px' }}>Loading Live Feed...</div>
            )}

            {/* Top Stories Banner (3 Big Stories) */}
            <TopStories articles={topArticles} />

            <div className="container">
                {/* Main Content + Most Popular Sidebar Layout */}
                <div className={styles.homeGridWithSidebar}>
                    {/* Left: NEWS + GUIDES & TIPS */}
                    <div className={styles.homeMainContent}>
                        {/* NEWS Section */}
                        {news && <LatestNews
                            articles={newsArticles}
                            title="NEWS"
                            seeAllText="All"
                            seeAllHref="/news"
                        />}

                        {/* GUIDES & TIPS Section */}
                        {initialGuides && initialGuides.length > 0 && (
                            <DualColumnNews
                                articles={initialGuides.slice(1, 13)}
                                title="GUIDES & TIPS"
                                seeAllText="All"
                                seeAllHref="/guides-and-tips"
                            />
                        )}
                    </div>

                    {/* Right: MOST POPULAR Sidebar */}
                    {popularArticlesForSidebar.length > 0 && (
                        <div className={styles.homeSidebarColumn}>
                            <div className={styles.sidebarSticky}>
                                {/* Leaderboard */}
                                {lbData && lbData.players && (
                                    <Leaderboard players={lbData.players.slice(0, 6)} />
                                )}

                                {/* Social Stats */}
                                <div className={styles.socialWidget}>
                                    <div className={styles.socialBoxCard}>
                                        <div className={styles.socialBoxIcon} style={{ color: '#3b5998' }}>f</div>
                                        <a href="https://facebook.com/thegolfpress" target="_blank" rel="noopener noreferrer" className={styles.socialFollowBtn}>Like</a>
                                    </div>
                                    <div className={styles.socialBoxCard}>
                                        <div className={styles.socialBoxIcon} style={{ color: '#111' }}>𝕏</div>
                                        <a href="https://twitter.com/thegolfpress" target="_blank" rel="noopener noreferrer" className={styles.socialFollowBtn}>Follow</a>
                                    </div>
                                    <div className={styles.socialBoxCard}>
                                        <div className={styles.socialBoxIcon} style={{ color: '#ff0000' }}>▶</div>
                                        <a href="https://youtube.com/@thegolfpress" target="_blank" rel="noopener noreferrer" className={styles.socialFollowBtn} style={{ background: '#ff0000', color: '#fff', border: 'none' }}>Subscribe</a>
                                    </div>
                                </div>

                                {/* MOST POPULAR */}
                                <div className={styles.popularHeader}>
                                    <h3 className={styles.popularHeaderTitle}>MOST POPULAR</h3>
                                </div>
                                <div className={styles.popularList}>
                                    {popularArticlesForSidebar.map((article: any, index: number) => {
                                        const category = (article.category || article.categoryTag || '').toUpperCase();
                                        let linkHref = `/news/${article.id}`;
                                        if (category === 'COURSES') linkHref = `/courses/${article.id}`;
                                        else if (category === 'GUIDES-TIPS') linkHref = `/guides-and-tips/post/${article.id}`;
                                        else if (category === 'EQUIPMENT') linkHref = `/equipment/${article.id}`;
                                        else if (category === 'LIFESTYLE') linkHref = `/lifestyle/${article.id}`;

                                        return (
                                            <div key={article.id} className={styles.popularItem}>
                                                <Link href={linkHref} className={styles.popularImageLink}>
                                                    <div className={styles.popularImageWrapper}>
                                                        <span className={styles.popularRank}>{index + 1}</span>
                                                        <Image
                                                            src={article.image || '/images/placeholder.jpg'}
                                                            alt={article.title}
                                                            fill
                                                            sizes="100px"
                                                            className={styles.popularArticleImage}
                                                        />
                                                    </div>
                                                </Link>
                                                <div className={styles.popularItemInfo}>
                                                    <Link href={linkHref}>
                                                        <h4 className={styles.popularTitle}>{article.title}</h4>
                                                    </Link>
                                                    <div className={styles.popularDateRow}>
                                                        <span className={styles.popularBadge}>
                                                            {article.category || 'NEWS'}
                                                        </span>
                                                        <span className={styles.popularDate}>
                                                            {article.viewCount > 0 ? `${article.viewCount.toLocaleString()} views` : new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* LIFESTYLE Section - Always show mock if empty */}
                <ThreeColumnImageNews
                    articles={lifestyleDisplay}
                    title="LIFESTYLE"
                />

                {/* EQUIPMENT & COURSES Section Combo */}
                <EquipmentAndCoursesNews
                    equipmentArticles={initialEquipment}
                    coursesArticles={initialCourses}
                />
            </div>
        </>
    );
}
