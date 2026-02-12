import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GolfService {
    private readonly logger = new Logger(GolfService.name);
    private readonly LEADERBOARD_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga';
    private readonly SCOREBOARD_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard';
    private readonly STATS_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/statistics';
    private readonly PLAYER_PROFILE_BASE_URL = 'https://sports.core.api.espn.com/v2/sports/golf/athletes/';

    constructor(private prisma: PrismaService) { }

    private async fetchJson(url: string, logError = true) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (!response.ok) {
                if (logError) {
                    this.logger.error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`);
                }
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            if (logError) {
                this.logger.error(`Error fetching ${url}: ${error.message}`);
            }
            throw error;
        }
    }

    async getLeaderboard() {
        try {
            const data = await this.fetchJson(this.LEADERBOARD_URL);
            const event = data.events?.[0];
            if (!event) return { players: [] };

            const competitors = event.competitions?.[0]?.competitors || [];
            return {
                tournamentName: event.name,
                players: competitors.map((c: any) => {
                    const linescores = c.linescores || [];
                    const todayScore = linescores.find((l: any) => l.period === event.competitions[0].status.period);

                    return {
                        id: c.athlete?.id,
                        position: c.status?.position?.displayName || '--',
                        name: c.athlete?.shortName || c.athlete?.displayName,
                        score: c.score?.displayValue || 'E',
                        thru: c.status?.displayThru || c.status?.detail || '--',
                        today: todayScore?.displayValue || 'E',
                        totalStrokes: c.score?.value || '--',
                        rounds: [1, 2, 3, 4].map(roundNum => {
                            const round = linescores.find((l: any) => l.period === roundNum);
                            if (!round) return '--';
                            return round.value > 0 ? round.value.toString() : '--';
                        }),
                        image: c.athlete?.headshot?.href || '',
                        country: c.athlete?.flag?.href || '',
                        countryName: c.athlete?.flag?.alt || 'USA',
                    };
                }),
            };
        } catch (error) {
            this.logger.error('Error fetching leaderboard', error);
            throw error;
        }
    }

    async getScoreboard() {
        try {
            return await this.fetchJson(this.SCOREBOARD_URL);
        } catch (error) {
            this.logger.error('Error fetching scoreboard', error);
            throw error;
        }
    }

    async getUpcomingEvents() {
        try {
            const data = await this.fetchJson(this.SCOREBOARD_URL);
            const calendar = data.leagues?.[0]?.calendar || [];

            const now = new Date();
            return calendar
                .filter((item: any) => new Date(item.endDate) >= now) // Include current event
                .slice(0, 5)
                .map((item: any) => {
                    const startDate = new Date(item.startDate);
                    const endDate = new Date(item.endDate);
                    return {
                        month: startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
                        date: `${startDate.getDate()}-${endDate.getDate()}`,
                        name: item.label,
                        location: 'TBD', // API doesn't provide location in calendar
                        purse: 'TBD',
                    };
                });
        } catch (error) {
            this.logger.error('Error fetching upcoming events', error);
            throw error;
        }
    }

    async getSchedule() {
        try {
            const data = await this.fetchJson(this.SCOREBOARD_URL);
            const calendar = data.leagues?.[0]?.calendar || [];

            return calendar.map((item: any) => {
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);

                return {
                    id: item.id,
                    name: item.label,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    displayDate: `${startDate.toLocaleString('en-US', { month: 'short' })} ${startDate.getDate()} - ${endDate.getDate()}`,
                    status: new Date(item.endDate) < new Date() ? 'COMPLETED' : (new Date(item.startDate) <= new Date() ? 'LIVE' : 'UPCOMING'),
                    location: 'TBD',
                    purse: 'TBD'
                };
            });
        } catch (error) {
            this.logger.error('Error fetching schedule', error);
            throw error;
        }
    }

    async getLiveFeed() {
        return this.getLeaderboard();
    }

    async getRankings() {
        try {
            const data = await this.fetchJson(this.STATS_URL);
            const categories = data.stats?.categories || [];

            return categories.map((cat: any) => ({
                id: cat.name,
                name: cat.displayName,
                leaders: cat.leaders?.map((l: any, idx: number) => ({
                    rank: idx + 1,
                    athlete: {
                        id: l.athlete?.id,
                        name: l.athlete?.displayName,
                        image: l.athlete?.headshot?.href,
                        links: l.athlete?.links
                    },
                    value: l.displayValue
                }))
            }));
        } catch (error) {
            this.logger.error('Error fetching rankings', error);
            throw error;
        }
    }

    async getPlayerProfile(id: string) {
        if (!id || id === 'undefined') {
            throw new Error('Invalid player ID provided');
        }
        try {
            const profileUrl = `${this.PLAYER_PROFILE_BASE_URL}${id}`;
            this.logger.log(`Fetching player profile from: ${profileUrl}`);
            const profile = await this.fetchJson(profileUrl);
            this.logger.log(`Successfully fetched profile for: ${profile.displayName}`);

            // Fix Turned Pro year: Sometimes missing in base athlete profile, check league profile
            if (profile.turnedPro === undefined || profile.turnedPro === null) {
                try {
                    const leagueAthleteUrl = `https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/athletes/${id}`;
                    const leagueProfile = await this.fetchJson(leagueAthleteUrl, false);
                    if (leagueProfile && leagueProfile.turnedPro) {
                        profile.turnedPro = leagueProfile.turnedPro;
                        this.logger.log(`Found turnedPro (${profile.turnedPro}) in league profile for ${id}`);
                    }
                } catch (e) {
                    this.logger.warn(`Could not fetch league-specific profile for id ${id}`);
                }
            }

            // Fetch College Name if available
            let collegeName = null;
            if (profile.college?.$ref) {
                try {
                    const collegeData = await this.fetchJson(profile.college.$ref, false);
                    collegeName = collegeData.name;
                } catch (e) {
                    this.logger.warn(`Could not fetch college data for ${id}`);
                }
            }

            // Fetch detailed stats (Current Season and Career Totals)
            let detailedStats = null;
            let careerTotals = { wins: 0, cutsMade: 0, earnings: 0 };

            // 1. Fetch Current Season (2026) Stats DIRECTLY for maximum reliability
            try {
                const currentSeasonUrl = `https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/seasons/2026/types/2/athletes/${id}/statistics/0`;
                detailedStats = await this.fetchJson(currentSeasonUrl, false);
                this.logger.log(`Fetched direct 2026 stats for ${id}`);
            } catch (e) {
                this.logger.warn(`Could not fetch direct 2026 stats for athlete ${id}, will try log`);
            }

            // 2. Aggregate Career Totals from Statistics Log
            if (profile.statisticslog?.$ref) {
                try {
                    const statsLog = await this.fetchJson(profile.statisticslog.$ref);

                    if (statsLog.entries) {
                        const statsRefs = statsLog.entries
                            .flatMap((e: any) => e.statistics || [])
                            .filter((s: any) => s.type === 'league')
                            .map((s: any) => s.statistics?.$ref)
                            .filter(Boolean);

                        const allSeasonStats = await Promise.all(
                            statsRefs.map(ref => this.fetchJson(ref, false).catch(() => null))
                        );

                        allSeasonStats.forEach(statsData => {
                            if (!statsData) return;

                            // If we didn't get direct 2026 stats, check if they are in the log
                            if (!detailedStats && statsData.seasonType?.$ref?.includes('/2026/')) {
                                detailedStats = statsData;
                            }

                            const generalStats = statsData.splits?.categories?.find((c: any) => c.name === 'general')?.stats;
                            if (generalStats) {
                                careerTotals.wins += generalStats.find((s: any) => s.name === 'wins')?.value || 0;
                                careerTotals.cutsMade += generalStats.find((s: any) => s.name === 'cutsMade')?.value || 0;
                                careerTotals.earnings += generalStats.find((s: any) => s.name === 'officialAmount')?.value || 0;
                            }
                        });
                    }
                } catch (statsError) {
                    this.logger.warn(`Could not fetch stats log for ${id}: ${statsError.message}`);
                }
            }

            // Fetch recent results (event log)
            let recentResults: any[] = [];
            try {
                // Get athlete events for 2026 season
                const eventsUrl = `https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/seasons/2026/athletes/${id}/events`;
                const eventsData = await this.fetchJson(eventsUrl);

                if (eventsData?.items) {
                    // Take last 5 events
                    const lastEvents = eventsData.items.slice(-5).reverse();

                    recentResults = await Promise.all(lastEvents.map(async (eventRef: any) => {
                        try {
                            const event = await this.fetchJson(eventRef.$ref, false);

                            // Get status/rank and score for this athlete in this event
                            const competitorUrl = `${eventRef.$ref.split('?')[0]}/competitions/${event.id}/competitors/${id}`;
                            const [status, score, stats] = await Promise.all([
                                this.fetchJson(`${competitorUrl}/status`, false).catch(() => null),
                                this.fetchJson(`${competitorUrl}/score`, false).catch(() => null),
                                this.fetchJson(`${competitorUrl}/statistics/0`, false).catch(() => null)
                            ]);

                            const officialAmount = stats?.splits?.categories
                                ?.flatMap(c => c.stats)
                                ?.find(s => s.name === 'officialAmount')?.displayValue || '--';

                            return {
                                id: event.id,
                                name: event.name,
                                shortName: event.shortName,
                                date: event.date,
                                rank: status?.position?.displayName || '--',
                                score: score?.displayValue || '--',
                                earnings: officialAmount
                            };
                        } catch (e) {
                            return null;
                        }
                    }));
                    recentResults = recentResults.filter(r => r !== null);
                }
            } catch (eventError) {
                this.logger.warn(`Could not fetch event log for ${id}: ${eventError.message}`);
            }

            // Fetch upcoming events from the tour schedule
            let upcomingEvents = [];
            try {
                const schedule = await this.getSchedule();
                const now = new Date();
                upcomingEvents = schedule
                    .filter((ev: any) => new Date(ev.startDate) > now)
                    .slice(0, 3);
            } catch (err) {
                this.logger.warn(`Could not fetch upcoming events for player profile: ${err.message}`);
            }

            // Fetch Related News from Database (fast & non-blocking)
            let relatedNews: any[] = [];
            try {
                relatedNews = await this.prisma.news.findMany({
                    where: {
                        OR: [
                            { title: { contains: profile.displayName, mode: 'insensitive' } },
                            { excerpt: { contains: profile.displayName, mode: 'insensitive' } }
                        ]
                    },
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: {}
                });
            } catch (newsError) {
                this.logger.warn(`Could not fetch related news for ${profile.displayName}: ${newsError.message}`);
            }

            // Extract Performance Chart Data
            let performanceStats: any = null;
            if (detailedStats) {
                const stats = (detailedStats as any).splits?.categories?.find((c: any) => c.name === 'general')?.stats || [];
                const findStat = (name: string) => stats.find(s => s.name === name);

                performanceStats = [
                    { name: 'Driving Distance', value: findStat('yardsPerDrive')?.value || 0, tourAvg: 298 },
                    { name: 'Driving Accuracy', value: findStat('driveAccuracyPct')?.value || 0, tourAvg: 59 },
                    { name: 'GIR %', value: findStat('greensInRegPct')?.value || 0, tourAvg: 66 },
                    { name: 'Putts per GIR', value: (findStat('puttsGirAvg')?.value || 0) * 50, tourAvg: 1.78 * 50 }, // Scaling for chart visibility
                    { name: 'Scoring Avg', value: (100 - (findStat('scoringAverage')?.value || 70)), tourAvg: (100 - 71) } // Inverse scaling (lower is better)
                ];
            }

            return {
                ...profile,
                id: profile.id,
                name: profile.displayName,
                image: profile.headshot?.href,
                seasonStats: detailedStats,
                careerTotals,
                recentResults,
                performanceStats,
                upcomingEvents,
                collegeName,
                relatedNews
            };
        } catch (error) {
            this.logger.error(`Error fetching player profile for ID ${id}`, error);
            throw error;
        }
    }

    async getNews(category?: string) {
        return this.prisma.news.findMany({
            where: category ? { category } : {},

            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getNewsById(id: string) {
        return this.prisma.news.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1
                }
            },

        });
    }

    async getTrendingNews() {
        return this.prisma.news.findMany({
            orderBy: {
                viewCount: 'desc'
            },
            take: 5,

        });
    }

    async createNews(data: any) {
        return this.prisma.news.create({
            data: {
                title: data.title,
                excerpt: data.excerpt,
                content: data.content,
                image: data.image,
                category: data.category,
                type: data.type || 'REGULAR',
                categoryTag: data.categoryTag || data.category,
                time: data.time || new Date().toLocaleDateString(),
                status: data.status || 'PUBLISHED',
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),

                // Relations handling
                categoryRef: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
                subTag: data.subTagId ? { connect: { id: data.subTagId } } : undefined
            }
        });
    }

    async updateNews(id: string, data: any) {
        return this.prisma.news.update({
            where: { id },
            data: {
                title: data.title,
                excerpt: data.excerpt,
                content: data.content,
                image: data.image,
                category: data.category,
                type: data.type,
                categoryTag: data.categoryTag,
                status: data.status,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
                categoryId: data.categoryId || null,
                categoryRef: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
                subTagId: data.subTagId || null,
                subTag: data.subTagId ? { connect: { id: data.subTagId } } : undefined,

            }
        });
    }

    // Category Management
    async getCategories() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                subTags: true,
                _count: {
                    select: { news: true }
                }
            }
        });
    }

    async createCategory(data: any) {
        const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        return this.prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug || slug
            }
        });
    }

    async updateCategory(id: string, data: any) {
        return this.prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug
            }
        });
    }

    async deleteCategory(id: string) {
        return this.prisma.category.delete({
            where: { id }
        });
    }

    // Sub-Tag Management
    async getSubTags(categoryId?: string) {
        return this.prisma.subTag.findMany({
            where: categoryId ? { categoryId } : {},
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { news: true }
                }
            }
        });
    }

    async createSubTag(data: any) {
        return this.prisma.subTag.create({
            data: {
                name: data.name,
                categoryId: data.categoryId
            }
        });
    }

    async updateSubTag(id: string, data: any) {
        return this.prisma.subTag.update({
            where: { id },
            data: {
                name: data.name,
                categoryId: data.categoryId
            }
        });
    }

    async deleteSubTag(id: string) {
        return this.prisma.subTag.delete({
            where: { id }
        });
    }

    async deleteNews(id: string) {
        return this.prisma.news.delete({
            where: { id }
        });
    }



    async getStats() {
        const [userCount, newsCount, publishedCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.news.count(),
            this.prisma.news.count({ where: { status: 'PUBLISHED' } })
        ]);

        return {
            totalUsers: userCount,
            totalPosts: newsCount,
            publishedPosts: publishedCount,
            draftPosts: newsCount - publishedCount
        };
    }

    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
    }

    async updateUserRole(id: string, role: any) {
        return this.prisma.user.update({
            where: { id },
            data: { role }
        });
    }

    async getSettings() {
        return this.prisma.setting.findMany();
    }

    async updateSetting(key: string, value: string) {
        return this.prisma.setting.update({
            where: { key },
            data: { value }
        });
    }
}
