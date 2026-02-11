'use client';

import { useEffect, useState } from 'react';
import LiveFeed from '@/components/LiveFeed';
import Hero from '@/components/Hero';
import SubNews from '@/components/SubNews';
import Leaderboard from '@/components/Leaderboard';
import Upcoming from '@/components/Upcoming';
import LatestNews from '@/components/LatestNews';
import HowToSection from '@/components/HowToSection';
import CoursesSection from '@/components/CoursesSection';
import { fetchLeaderboard, fetchUpcoming, fetchNews } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [lbData, setLbData] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[] | null>(null);
  const [news, setNews] = useState<any[] | null>(null);
  const [howTo, setHowTo] = useState<any[] | null>(null);
  const [courses, setCourses] = useState<any[] | null>(null);

  useEffect(() => {
    // Fetch data in parallel without blocking each other
    async function loadData() {
      // Leaderboard
      fetchLeaderboard()
        .then(data => setLbData(data))
        .catch(err => console.error('Error loading leaderboard:', err));

      // Upcoming
      fetchUpcoming()
        .then(data => setUpcoming(data))
        .catch(err => console.error('Error loading upcoming:', err));

      // News
      // News
      fetchNews()
        .then(data => setNews(data))
        .catch(err => console.error('Error loading news:', err));

      // How To
      fetchNews('HOW-TO')
        .then(data => setHowTo(data))
        .catch(err => console.error('Error loading how-to:', err));

      // Courses
      fetchNews('COURSES')
        .then(data => setCourses(data))
        .catch(err => console.error('Error loading courses:', err));
    }
    loadData();
  }, []);

  const feedPlayers = lbData?.players?.slice(0, 10) || [];
  const leaderboardPlayers = lbData?.players?.slice(0, 4) || [];

  // Distribute news if available
  const heroArticle = news && news.length > 0 ? news[0] : null;
  const subNewsArticles = news && news.length > 1 ? news.slice(1, 3) : [];
  const latestNewsArticles = news && news.length > 3 ? news.slice(3) : [];

  return (
    <main>
      {/* Live Feed Loading State */}
      {lbData ? (
        <LiveFeed players={feedPlayers} />
      ) : (
        <div className={styles.skeleton} style={{ padding: '20px' }}>Loading Live Feed...</div>
      )}

      <div className="container">
        <div className={styles.mainGrid}>
          <div className={styles.leftCol}>
            {/* Hero & SubNews Loading State */}
            {news ? (
              <>
                {heroArticle && <Hero article={heroArticle} />}
                {subNewsArticles.length > 0 && <SubNews articles={subNewsArticles} />}
              </>
            ) : (
              <div className={styles.skeleton} style={{ height: '400px' }}>
                Loading News...
              </div>
            )}
          </div>

          <div className={styles.rightCol}>
            {/* Leaderboard Loading State */}
            {lbData ? (
              <Leaderboard players={leaderboardPlayers} />
            ) : (
              <div className={styles.skeleton} style={{ height: '300px' }}>
                Loading Leaderboard...
              </div>
            )}

            {/* Upcoming Loading State */}
            {upcoming ? (
              <Upcoming events={upcoming} />
            ) : (
              <div className={styles.skeleton} style={{ height: '200px' }}>
                Loading Events...
              </div>
            )}
          </div>
        </div>

        {/* Dedicated Sections */}
        <HowToSection articles={howTo || []} />
        <CoursesSection courses={courses || []} />

        {/* Latest News Loading State */}
        {news ? (
          latestNewsArticles.length > 0 && <LatestNews articles={latestNewsArticles} />
        ) : (
          <div className={styles.skeleton} style={{ marginTop: '40px', height: '200px' }}>
            Loading Latest News...
          </div>
        )}
      </div>
    </main>
  );
}
