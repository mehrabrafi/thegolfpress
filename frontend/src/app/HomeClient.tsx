'use client';

import { useEffect, useState } from 'react';
import LiveFeed from '@/components/LiveFeed';
import TopStories from '@/components/TopStories';
import JsonLd, { createWebsiteJsonLd } from '@/components/JsonLd';
import { fetchLeaderboard } from '@/lib/api';
import LatestNews from '@/components/LatestNews';
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
    const topArticles = [
        news && news.length > 0 ? news[0] : null,
        initialEquipment && initialEquipment.length > 0 ? initialEquipment[0] : null,
        initialGuides && initialGuides.length > 0 ? initialGuides[0] : null
    ].filter(Boolean);

    const newsArticles = news && news.length > 1 ? news.slice(1, 11) : [];

    // Placeholder data for Lifestyle if empty (so user can see the layout)
    const mockLifestyle = [
        { id: '1', title: 'Top 10 Golf Destinations for your Next Vacation', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'Explore the world\'s most beautiful courses and where to stay for the ultimate golf experience.' },
        { id: '2', title: 'Summer Collection: 2026 Golf Apparel Guide', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'Stay cool and look sharp on the course with these top-rated apparel picks for the summer season.' },
        { id: '3', title: 'The Evolution of Luxury Golf Watches', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'How timepieces became an essential part of the golfer\'s wardrobe and style.' },
        { id: '4', title: 'Inside the Most Exclusive Golf Clubhouses', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'A look behind the gates of the world\'s most private and prestigious golf clubs.' },
        { id: '5', title: 'Golf & Gastronomy: The Best 19th Holes', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'Discover the clubs that offer world-class dining experiences after your round.' },
        { id: '6', title: 'The Rise of Performance Tech in Golf Fashion', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'How modern fabrics are changing the way players think about comfort and style.' },
        { id: '7', title: 'Art on the Green: Minimalist Course Photography', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-timescale-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'Meeting the photographers capturing the raw beauty of golf landscapes.' },
        { id: '8', title: 'Restorative Golf: The Best Wellness Spas', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'Combining a championship round with top-tier recovery and wellness treatments.' },
        { id: '9', title: 'Vintage Vibes: The Return of Heritage Gear', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'Why classic designs and natural materials are making a massive comeback.' },
        { id: '10', title: 'Collectors Edition: Rare Golf Memorabilia', image: 'https://cdn.thegolfpress.com/ai-generated-high-resolution-image-showcasing-luxurious-golden-golf-putter-positioned-next-to-white-ball-sleek-dark-surface-397852118.jpg.png', category: 'LIFESTYLE', excerpt: 'A guide to investing in the artifacts that defined the history of the game.' }
    ];

    const lifestyleDisplay = (initialLifestyle && initialLifestyle.length > 0) ? initialLifestyle.slice(0, 10) : mockLifestyle;

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
                {/* NEWS Section */}
                {news && <LatestNews
                    articles={newsArticles}
                    title="NEWS"
                    seeAllText="SEE ALL NEWS"
                    seeAllHref="/news"
                />}

                {/* EQUIPMENT Section */}
                {initialEquipment && initialEquipment.length > 0 && (
                    <LatestNews
                        articles={initialEquipment.slice(0, 10)}
                        title="EQUIPMENT"
                        seeAllText="SEE ALL EQUIPMENT"
                        seeAllHref="/equipment"
                    />
                )}

                {/* LIFESTYLE Section - Always show mock if empty */}
                <LatestNews
                    articles={lifestyleDisplay}
                    title="LIFESTYLE"
                    seeAllText="SEE ALL LIFESTYLE"
                    seeAllHref="/lifestyle"
                />

                {/* GUIDES & TIPS Section */}
                {initialGuides && initialGuides.length > 0 && (
                    <LatestNews
                        articles={initialGuides.slice(1, 11)}
                        title="GUIDES & TIPS"
                        seeAllText="SEE ALL GUIDES & TIPS"
                        seeAllHref="/guides-and-tips"
                    />
                )}

                {/* COURSES Section */}
                {initialCourses && initialCourses.length > 0 && (
                    <LatestNews
                        articles={initialCourses.slice(1, 11)}
                        title="COURSES"
                        seeAllText="SEE ALL COURSES"
                        seeAllHref="/courses"
                    />
                )}
            </div>
        </>
    );
}
