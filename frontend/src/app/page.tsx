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

  // Filter out Guides & Tips and Courses from general news
  const rawNews = allNews.status === 'fulfilled' ? allNews.value : [];
  const filteredNews = rawNews.filter((item: any) => {
    const cat = (item.category || '').toUpperCase();
    return cat !== 'GUIDES-TIPS' && cat !== 'COURSES' && cat !== 'COURSE';
  });

  const trending = trendingData.status === 'fulfilled' ? trendingData.value : [];
  const homeSections = sections.status === 'fulfilled' ? sections.value : [];

  // Fetch articles for each dynamic section
  const sectionArticles: { [key: string]: any[] } = {};
  console.log(`[Home] Processing ${homeSections.length} active home sections...`);

  await Promise.all(
    homeSections.map(async (section: any) => {
      try {
        console.log(`[Home] Fetching articles for section: "${section.title}" (Category: ${section.category})`);
        const articles = await fetchNews(section.category);
        console.log(`[Home] Section "${section.title}" returned ${articles.length} articles.`);
        sectionArticles[section.id] = articles.slice(0, section.maxItems);
      } catch (err) {
        console.error(`[Home] Error loading articles for section ${section.id} (${section.title}):`, err);
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
