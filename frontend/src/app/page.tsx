import { fetchLeaderboard, fetchNews, fetchTrendingNews } from '@/lib/api';
import HomeClient from './HomeClient';

export default async function Home() {
  // Fetch all data server-side in parallel
  const [leaderboardData, allNews, trendingData, guidesNews, coursesNews, equipmentNews, lifestyleNews] = await Promise.allSettled([
    fetchLeaderboard(),
    fetchNews(), // General News
    fetchTrendingNews(),
    fetchNews('GUIDES-TIPS'),
    fetchNews('COURSES'),
    fetchNews('EQUIPMENT'),
    fetchNews('LIFESTYLE'),
  ]);

  const leaderboard = leaderboardData.status === 'fulfilled' ? leaderboardData.value : null;

  // Filter out specialized categories from general news
  const rawNews = allNews.status === 'fulfilled' ? allNews.value.data : [];
  const filteredNews = rawNews.filter((item: any) => {
    const cat = (item.category || '').toUpperCase();
    const exclude = ['GUIDES-TIPS', 'COURSES', 'EQUIPMENT', 'EQUIPMENT-REVIEW', 'LIFESTYLE'];
    return !exclude.includes(cat) && cat !== 'COURSE' && cat !== 'HOW-TO';
  });

  const trending = trendingData.status === 'fulfilled' ? trendingData.value : [];
  const guides = guidesNews.status === 'fulfilled' ? guidesNews.value.data : [];
  const courses = coursesNews.status === 'fulfilled' ? coursesNews.value.data : [];
  const equipment = equipmentNews.status === 'fulfilled' ? equipmentNews.value.data : [];
  const lifestyle = lifestyleNews.status === 'fulfilled' ? lifestyleNews.value.data : [];

  return (
    <HomeClient
      initialNews={filteredNews.length > 0 ? filteredNews : null}
      initialTrending={trending.length > 0 ? trending : null}
      initialLeaderboard={leaderboard}
      initialGuides={guides}
      initialCourses={courses}
      initialEquipment={equipment}
      initialLifestyle={lifestyle}
    />
  );
}
