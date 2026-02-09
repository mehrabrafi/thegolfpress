import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GolfService {
    private readonly logger = new Logger(GolfService.name);
    private readonly LEADERBOARD_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga';
    private readonly SCOREBOARD_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard';
    private readonly STATISTICS_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/statistics';

    constructor(private prisma: PrismaService) { }

    private async fetchJson(url: string) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return await response.json();
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
                        position: c.status?.position?.displayName || '--',
                        name: c.athlete?.shortName || c.athlete?.displayName,
                        score: c.score?.displayValue || 'E',
                        thru: c.status?.displayThru || c.status?.detail || '--',
                        today: todayScore?.displayValue || 'E',
                        totalStrokes: c.score?.value || '--',
                        rounds: [1, 2, 3, 4].map(roundNum => {
                            const round = linescores.find((l: any) => l.period === roundNum);
                            // If round is completed (not current), show strokes (value). 
                            // If current, show displayValue. If not started, show --.
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
            const data = await this.fetchJson(this.STATISTICS_URL);
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

    async getNews() {
        return this.prisma.news.findMany({
            include: {
                author: true
            },
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
            include: {
                author: true
            }
        });
    }

    async getTrendingNews() {
        return this.prisma.news.findMany({
            orderBy: {
                viewCount: 'desc'
            },
            take: 5,
            include: {
                author: true
            }
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
                // Default values or simple handling for now
                type: data.type || 'REGULAR',
                categoryTag: data.categoryTag || data.category,
                time: new Date().toLocaleDateString(), // Simple date string for now
                author: {
                    connect: { id: data.authorId } // Assuming author exists
                }
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
            }
        });
    }

    async deleteNews(id: string) {
        return this.prisma.news.delete({
            where: { id }
        });
    }
}
