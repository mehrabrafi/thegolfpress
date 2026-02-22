import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) { }

    async getAllPlayers(userId?: string) {
        const players = await this.prisma.player.findMany({
            orderBy: { name: 'asc' },
        });

        if (!userId) return players.map(p => ({ ...p, isFollowed: false }));

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { followedPlayers: true },
        });

        const followedIds = user?.followedPlayers.map(p => p.id) || [];
        return players.map(p => ({
            ...p,
            isFollowed: followedIds.includes(p.id)
        }));
    }

    async getPlayerById(id: string) {
        return this.prisma.player.findUnique({
            where: { id },
        });
    }

    async followPlayer(userId: string, playerId: string) {
        const player = await this.prisma.player.findUnique({
            where: { id: playerId }
        });
        if (!player) throw new NotFoundException('Player not found');

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                followedPlayers: {
                    connect: { id: playerId }
                }
            }
        });

        return { message: 'Player followed successfully' };
    }

    async unfollowPlayer(userId: string, playerId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                followedPlayers: {
                    disconnect: { id: playerId }
                }
            }
        });

        return { message: 'Player unfollowed successfully' };
    }

    async getMyFeed(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { followedPlayers: true },
        });

        if (!user) return [];

        // Parse preferred categories from onboarding
        let preferredCategories: string[] = [];
        try {
            preferredCategories = JSON.parse(user.preferredCategories || '[]');
        } catch {
            preferredCategories = [];
        }

        const playerIds = user.followedPlayers.map(p => p.id);

        // If user has no preferences and no followed players, return latest published news as fallback
        if (preferredCategories.length === 0 && playerIds.length === 0) {
            return this.prisma.news.findMany({
                where: { status: 'PUBLISHED' },
                orderBy: { createdAt: 'desc' },
                take: 15,
            });
        }

        // Build OR conditions for personalized feed
        const orConditions: any[] = [];

        // Condition 1: News matching preferred categories or sub-tags
        if (preferredCategories.length > 0) {
            orConditions.push({
                OR: [
                    { category: { in: preferredCategories } },
                    { categoryTag: { in: preferredCategories } },
                ]
            });
        }

        // Condition 2: News tagged with followed players
        if (playerIds.length > 0) {
            orConditions.push({
                players: {
                    some: {
                        id: { in: playerIds },
                    },
                },
            });
        }

        return this.prisma.news.findMany({
            where: {
                status: 'PUBLISHED',
                OR: orConditions,
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
    }

    async createPlayer(data: { name: string; slug: string; image?: string }) {
        return this.prisma.player.create({ data });
    }

    async updatePlayer(id: string, data: { name?: string; slug?: string; image?: string }) {
        return this.prisma.player.update({
            where: { id },
            data,
        });
    }

    async deletePlayer(id: string) {
        return this.prisma.player.delete({
            where: { id },
        });
    }
}
