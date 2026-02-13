import { fetchLeaderboard, fetchNews, fetchHomeSections, fetchTrendingNews } from '@/lib/api';
import HomeClient from './HomeClient';

export default async function Home() {
  // Fetch all data server-side in parallel
  const [leaderboardData, allNews, trendingData, sections] = await Promise.allSettled([
    fetchLeaderboard(),
    fetchNews(),
    fetchTrendingNews(),
    fetchHomeSections(),
  ]);

  const leaderboard = leaderboardData.status === 'fulfilled' ? leaderboardData.value : null;

  // Filter out HOW-TO and COURSES from general news
  const rawNews = allNews.status === 'fulfilled' ? allNews.value : [];
  const filteredNews = rawNews.filter((item: any) => {
    const cat = (item.category || '').toUpperCase();
    return cat !== 'HOW-TO' && cat !== 'COURSES' && cat !== 'HOW TO' && cat !== 'COURSE';
  });

  const trending = trendingData.status === 'fulfilled' ? trendingData.value : [];
  const homeSections = sections.status === 'fulfilled' ? sections.value : [];

  // Fetch articles for each dynamic section
  const sectionArticles: { [key: string]: any[] } = {};
  await Promise.all(
    homeSections.map(async (section: any) => {
      try {
        const articles = await fetchNews(section.category);
        sectionArticles[section.id] = articles.slice(0, section.maxItems);
      } catch (err) {
        console.error(`Error loading articles for section ${section.id}:`, err);
      }
    })
  );

  return (
    <HomeClient
      initialNews={filteredNews.length > 0 ? filteredNews : null}
      initialTrending={trending.length > 0 ? trending : null}
      initialLeaderboard={leaderboard}
      initialSections={homeSections}
      initialSectionArticles={sectionArticles}
    />
  );
}
