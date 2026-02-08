'use client';

import { useEffect, useState } from 'react';
import LiveFeed from '@/components/LiveFeed';
import Hero from '@/components/Hero';
import SubNews from '@/components/SubNews';
import Leaderboard from '@/components/Leaderboard';
import Upcoming from '@/components/Upcoming';
import LatestNews from '@/components/LatestNews';
import { fetchLeaderboard, fetchUpcoming, fetchNews } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [lbData, setLbData] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [lb, up, newsData] = await Promise.all([
          fetchLeaderboard(),
          fetchUpcoming(),
          fetchNews()
        ]);
        setLbData(lb);
        setUpcoming(up);
        setNews(newsData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  const feedPlayers = lbData?.players?.slice(0, 10) || [];
  const leaderboardPlayers = lbData?.players?.slice(0, 4) || [];

  // Distribute news
  const heroArticle = news[0];
  const subNewsArticles = news.slice(1, 3);
  const latestNewsArticles = news.slice(3);

  return (
    <main>
      <LiveFeed players={feedPlayers} />
      <div className="container">
        <div className={styles.mainGrid}>
          <div className={styles.leftCol}>
            <Hero article={heroArticle} />
            <SubNews articles={subNewsArticles} />
          </div>
          <div className={styles.rightCol}>
            <Leaderboard players={leaderboardPlayers} />
            <Upcoming events={upcoming.length > 0 ? upcoming : []} />
          </div>
        </div>
        <LatestNews articles={latestNewsArticles} />
      </div>
    </main>
  );
}
