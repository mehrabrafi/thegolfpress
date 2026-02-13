'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LiveFeed from '@/components/LiveFeed';
import Hero from '@/components/Hero';
import SubNews from '@/components/SubNews';
import SidebarNews from '@/components/SidebarNews';
import Leaderboard from '@/components/Leaderboard';
import DynamicSection from '@/components/DynamicSection';
import { fetchLeaderboard, fetchNews, fetchHomeSections, fetchTrendingNews } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [lbData, setLbData] = useState<any>(null);
  const [news, setNews] = useState<any[] | null>(null);
  const [trendingNews, setTrendingNews] = useState<any[] | null>(null);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [sectionArticles, setSectionArticles] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    async function loadData() {
      // Leaderboard
      fetchLeaderboard()
        .then(data => setLbData(data))
        .catch(err => console.error('Error loading leaderboard:', err));

      // Home Sections (Dynamic)
      fetchHomeSections()
        .then(async (sections) => {
          setHomeSections(sections);

          // Fetch articles for each section
          const articlesMap: { [key: string]: any[] } = {};
          await Promise.all(sections.map(async (section: any) => {
            try {
              const articles = await fetchNews(section.category);
              articlesMap[section.id] = articles.slice(0, section.maxItems);
            } catch (err) {
              console.error(`Error loading articles for section ${section.id}:`, err);
            }
          }));
          setSectionArticles(articlesMap);
        })
        .catch(err => console.error('Error loading home sections:', err));

      // News
      fetchNews()
        .then(data => {
          // Filter out categories that are used in home sections to avoid duplication
          // (optional, but keep it for now as a general rule)
          const filteredNews = data.filter((item: any) => {
            const cat = (item.category || '').toUpperCase();
            // We'll hardcode the exclusions for now or make it dynamic later
            return cat !== 'HOW-TO' && cat !== 'COURSES' && cat !== 'HOW TO' && cat !== 'COURSE';
          });
          setNews(filteredNews);
        })
        .catch(err => console.error('Error loading news:', err));

      // Trending News
      fetchTrendingNews()
        .then(data => setTrendingNews(data))
        .catch(err => console.error('Error loading trending news:', err));
    }
    loadData();
  }, []);

  const feedPlayers = lbData?.players?.slice(0, 10) || [];
  const leaderboardPlayers = lbData?.players?.slice(0, 7) || [];

  // Distribute news if available
  const heroArticle = news && news.length > 0 ? news[0] : null;
  const subArticles = news && news.length > 1 ? news.slice(1, 7) : [];
  const sidebarArticles = trendingNews || [];

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
    </main >
  );
}
