'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LiveFeed from '@/components/LiveFeed';
import Hero from '@/components/Hero';
import SubNews from '@/components/SubNews';
import SidebarNews from '@/components/SidebarNews';
import Leaderboard from '@/components/Leaderboard';
import HowToSection from '@/components/HowToSection';
import CoursesSection from '@/components/CoursesSection';
import { fetchLeaderboard, fetchNews } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [lbData, setLbData] = useState<any>(null);

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
  const leaderboardPlayers = lbData?.players?.slice(0, 7) || [];

  // Distribute news if available
  const heroArticle = news && news.length > 0 ? news[0] : null;
  // Get next 6 articles for sub-news grid (bottom left) - fills two rows of 3
  const subArticles = news && news.length > 1 ? news.slice(1, 7) : [];
  // Get next 5 articles for sidebar news (right column) - shifted after subArticles
  const sidebarArticles = news && news.length > 7 ? news.slice(7, 12) : [];

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
                {subArticles.length > 0 && <SubNews articles={subArticles} />}
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

            {/* Sidebar News */}
            {sidebarArticles.length > 0 && <SidebarNews articles={sidebarArticles} />
            }
          </div>
        </div>

        {/* Dedicated Sections */}
        <HowToSection articles={howTo || []} />
        <CoursesSection courses={courses || []} />
      </div>
    </main >
  );
}
