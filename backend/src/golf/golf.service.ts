import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
                    const todayScore = linescores.find((l: any) => l.period === event.competitions?.[0]?.status?.period);

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

    async getNews(category?: string, tag?: string, status?: string) {
        this.logger.log(`Fetching news for category: ${category || 'ALL'} tag: ${tag || 'ALL'} status: ${status || 'PUBLISHED (default)'}`);
        const where: any = {};
        if (category) where.category = { equals: category, mode: 'insensitive' };
        if (tag) where.categoryTag = { equals: tag, mode: 'insensitive' };

        // Handle status filtering
        if (status === 'ALL') {
            // No status filter - return everything
        } else if (status) {
            where.status = status;
        } else {
            // Default: Only show PUBLISHED
            where.status = 'PUBLISHED';
        }

        return this.prisma.news.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleScheduledNews() {
        try {
            const now = new Date();
            const scheduledNews = await this.prisma.news.findMany({
                where: {
                    status: 'SCHEDULED',
                    publishedAt: {
                        lte: now
                    }
                }
            });

            if (scheduledNews.length > 0) {
                this.logger.log(`Found ${scheduledNews.length} scheduled news articles to publish.`);

                for (const news of scheduledNews) {
                    await this.prisma.news.update({
                        where: { id: news.id },
                        data: { status: 'PUBLISHED' }
                    });
                    this.logger.log(`Auto-published news article: ${news.title} (ID: ${news.id})`);
                }
            }
        } catch (error) {
            this.logger.error('Error processing scheduled news', error);
        }
    }

    async getNewsById(id: string) {
        try {
            const article = await this.prisma.news.update({
                where: { id },
                data: {
                    viewCount: {
                        increment: 1
                    }
                },
            });
            return article;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('News article not found');
            }
            throw error;
        }
    }

    async getTrendingNews() {
        return this.prisma.news.findMany({
            where: { status: 'PUBLISHED' },
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
                subTagId: data.subTagId || null,
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [userCount, newsCount, publishedCount, todayActivity] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.news.count(),
            this.prisma.news.count({ where: { status: 'PUBLISHED' } }),
            this.prisma.dailyActivity.count({
                where: {
                    date: {
                        gte: today
                    }
                }
            })
        ]);

        // Get 7-day activity graph data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const activityLog = await this.prisma.dailyActivity.findMany({
            where: {
                date: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                date: true,
                visitorId: true
            }
        });

        // Group by day
        const graphData: { date: string, count: number }[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];

            const count = new Set(
                activityLog
                    .filter(a => a.date.toISOString().split('T')[0] === dateStr)
                    .map(a => a.visitorId)
            ).size;

            graphData.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                count: count
            });
        }

        return {
            totalUsers: userCount,
            totalPosts: newsCount,
            publishedPosts: publishedCount,
            draftPosts: newsCount - publishedCount,
            dau: todayActivity,
            activityGraph: graphData
        };
    }

    async getSystemHealth() {
        const services: { name: string; status: 'operational' | 'degraded' | 'down'; responseTime?: number; details?: string }[] = [];

        // 1. Check Database
        const dbStart = Date.now();
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            services.push({
                name: 'Database',
                status: 'operational',
                responseTime: Date.now() - dbStart,
                details: 'PostgreSQL connected'
            });
        } catch (e) {
            services.push({
                name: 'Database',
                status: 'down',
                responseTime: Date.now() - dbStart,
                details: 'Connection failed'
            });
        }

        // 2. Check API Server (self — if we're responding, it's up)
        services.push({
            name: 'API Server',
            status: 'operational',
            responseTime: 0,
            details: 'NestJS running'
        });

        // 3. Check ESPN External API
        const espnStart = Date.now();
        try {
            const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga', {
                signal: AbortSignal.timeout(5000),
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            services.push({
                name: 'ESPN Data Feed',
                status: res.ok ? 'operational' : 'degraded',
                responseTime: Date.now() - espnStart,
                details: res.ok ? 'Live data available' : `HTTP ${res.status}`
            });
        } catch (e) {
            services.push({
                name: 'ESPN Data Feed',
                status: 'degraded',
                responseTime: Date.now() - espnStart,
                details: 'External API timeout'
            });
        }

        // 4. Memory usage
        const mem = process.memoryUsage();
        const memUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
        services.push({
            name: 'Memory',
            status: memUsedMB < 512 ? 'operational' : memUsedMB < 900 ? 'degraded' : 'down',
            details: `${memUsedMB} MB used`
        });

        // 5. Uptime
        const uptimeSec = Math.floor(process.uptime());
        const uptimeHours = Math.floor(uptimeSec / 3600);
        const uptimeMinutes = Math.floor((uptimeSec % 3600) / 60);

        const allOperational = services.every(s => s.status === 'operational');
        const anyDown = services.some(s => s.status === 'down');

        return {
            overall: anyDown ? 'down' : allOperational ? 'operational' : 'degraded',
            uptime: `${uptimeHours}h ${uptimeMinutes}m`,
            checkedAt: new Date().toISOString(),
            services
        };
    }

    async trackActivity(visitorId: string, userId?: string) {
        if (!visitorId) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        try {
            await this.prisma.dailyActivity.upsert({
                where: {
                    visitorId_date: {
                        visitorId,
                        date: today
                    }
                },
                update: {
                    userId: userId || undefined
                },
                create: {
                    visitorId,
                    userId,
                    date: today
                }
            });
        } catch (error) {
            // Ignore errors (e.g. concurrent upserts)
            this.logger.warn(`Error tracking activity: ${error.message}`);
        }
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

    // Maintenance Mode
    async getMaintenanceStatus() {
        const [modeSetting, endTimeSetting] = await Promise.all([
            this.prisma.setting.upsert({
                where: { key: 'maintenance_mode' },
                update: {},
                create: { key: 'maintenance_mode', value: 'false', type: 'boolean' },
            }),
            this.prisma.setting.upsert({
                where: { key: 'maintenance_end_time' },
                update: {},
                create: { key: 'maintenance_end_time', value: '', type: 'string' },
            }),
        ]);
        return {
            enabled: modeSetting.value === 'true',
            endTime: endTimeSetting.value || null,
        };
    }

    async updateSetting(key: string, value: string) {
        return this.prisma.setting.update({
            where: { key },
            data: { value }
        });
    }

    // Home Section Management
    async getHomeSections() {
        return this.prisma.homeSection.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
    }

    async getAllHomeSections() {
        return this.prisma.homeSection.findMany({
            orderBy: { order: 'asc' }
        });
    }

    async createHomeSection(data: any) {
        return this.prisma.homeSection.create({
            data: {
                title: data.title,
                category: data.category,
                order: data.order || 0,
                active: data.active !== undefined ? data.active : true,
                link: data.link,
                linkText: data.linkText,
                maxItems: data.maxItems || 4
            }
        });
    }

    async updateHomeSection(id: string, data: any) {
        return this.prisma.homeSection.update({
            where: { id },
            data: {
                title: data.title,
                category: data.category,
                order: data.order,
                active: data.active,
                link: data.link,
                linkText: data.linkText,
                maxItems: data.maxItems
            }
        });
    }

    async deleteHomeSection(id: string) {
        try {
            this.logger.log(`Deleting home section with ID: ${id}`);
            return await this.prisma.homeSection.delete({
                where: { id }
            });
        } catch (error) {
            this.logger.error(`Error deleting home section ${id}: ${error.message}`);
            if (error.code === 'P2025') {
                throw new NotFoundException(`Home section with ID ${id} not found`);
            }
            throw error;
        }
    }

    // ── Content Analytics ─────────────────────────────────────────

    async getContentAnalytics() {
        // 1. Views by Category (aggregated from the `category` field)
        const allNews = await this.prisma.news.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                id: true,
                title: true,
                category: true,
                categoryTag: true,
                type: true,
                viewCount: true,
                createdAt: true,
                image: true,
            }
        });

        // Aggregate views by category
        const categoryMap = new Map<string, { views: number, articles: number }>();
        for (const article of allNews) {
            const cat = article.category || 'Uncategorized';
            const existing = categoryMap.get(cat) || { views: 0, articles: 0 };
            existing.views += article.viewCount;
            existing.articles += 1;
            categoryMap.set(cat, existing);
        }
        const viewsByCategory = Array.from(categoryMap.entries())
            .map(([name, data]) => ({ name, views: data.views, articles: data.articles }))
            .sort((a, b) => b.views - a.views);

        // 2. Views by CategoryTag (sub-tag level breakdown)
        const tagMap = new Map<string, { views: number, articles: number }>();
        for (const article of allNews) {
            const tag = article.categoryTag || 'Untagged';
            const existing = tagMap.get(tag) || { views: 0, articles: 0 };
            existing.views += article.viewCount;
            existing.articles += 1;
            tagMap.set(tag, existing);
        }
        const viewsByTag = Array.from(tagMap.entries())
            .map(([name, data]) => ({ name, views: data.views, articles: data.articles }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 15);

        // 3. Top 10 articles by views
        const topArticles = [...allNews]
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 10)
            .map(a => ({
                id: a.id,
                title: a.title,
                category: a.category,
                views: a.viewCount,
                image: a.image,
            }));

        // 4. Type distribution (REGULAR, GUIDE, COURSE, etc.)
        const typeMap = new Map<string, { views: number, articles: number }>();
        for (const article of allNews) {
            const type = article.type || 'REGULAR';
            const existing = typeMap.get(type) || { views: 0, articles: 0 };
            existing.views += article.viewCount;
            existing.articles += 1;
            typeMap.set(type, existing);
        }
        const viewsByType = Array.from(typeMap.entries())
            .map(([name, data]) => ({ name, views: data.views, articles: data.articles }));

        // 5. Total metrics
        const totalViews = allNews.reduce((sum, n) => sum + n.viewCount, 0);
        const totalArticles = allNews.length;
        const avgViewsPerArticle = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

        // 6. Publishing trend (articles published per day, last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const publishTrend: { date: string; count: number; views: number }[] = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            const dateStr = d.toISOString().split('T')[0];

            const dayArticles = allNews.filter(
                a => a.createdAt.toISOString().split('T')[0] === dateStr
            );

            publishTrend.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: dayArticles.length,
                views: dayArticles.reduce((s, a) => s + a.viewCount, 0),
            });
        }

        return {
            totalViews,
            totalArticles,
            avgViewsPerArticle,
            viewsByCategory,
            viewsByTag,
            topArticles,
            viewsByType,
            publishTrend,
        };
    }

    async search(query: string) {
        if (!query || query.trim().length < 2) {
            return { news: [], categories: [], players: [] };
        }

        const searchTerm = query.trim();

        // Search news articles
        const newsResults = await this.prisma.news.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { excerpt: { contains: searchTerm, mode: 'insensitive' } },
                ],
                status: 'PUBLISHED',
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        // Search categories
        const categoryResults = await this.prisma.category.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { slug: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            include: {
                subTags: true,
                _count: { select: { news: true } },
            },
            take: 5,
        });

        // Search players via ESPN API
        let playerResults: any[] = [];
        try {
            const espnSearchUrl = `https://site.web.api.espn.com/apis/common/v3/search?query=${encodeURIComponent(searchTerm)}&limit=5&type=player&sport=golf`;
            const espnData = await this.fetchJson(espnSearchUrl, false);
            const items = espnData?.items || espnData?.results || [];

            // Handle different response structures
            if (Array.isArray(items)) {
                playerResults = items
                    .filter((item: any) => item?.type === 'player' || item?.athlete)
                    .slice(0, 5)
                    .map((item: any) => {
                        const athlete = item.athlete || item;
                        return {
                            id: athlete.id || item.id,
                            name: athlete.displayName || athlete.fullName || item.displayName || item.name,
                            image: athlete.headshot?.href || athlete.headshot || item.image || '',
                            country: athlete.flag?.alt || '',
                        };
                    });
            }
        } catch (err) {
            this.logger.warn(`ESPN player search failed for "${searchTerm}": ${err.message}`);
        }

        return {
            news: newsResults,
            categories: categoryResults,
            players: playerResults,
        };
    }
}
