import { Controller, Get, Param, Post, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { GolfService } from './golf.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('golf')
export class GolfController {
    constructor(private readonly golfService: GolfService) { }

    @Get('leaderboard')
    async getLeaderboard() {
        return this.golfService.getLeaderboard();
    }

    @Get('scoreboard')
    async getScoreboard() {
        return this.golfService.getScoreboard();
    }

    @Get('live-feed')
    async getLiveFeed() {
        return this.golfService.getLiveFeed();
    }

    @Get('upcoming')
    async getUpcoming() {
        return this.golfService.getUpcomingEvents();
    }

    @Get('schedule')
    async getSchedule() {
        return this.golfService.getSchedule();
    }

    @Get('rankings')
    async getRankings() {
        return this.golfService.getRankings();
    }

    @Get('news')
    async getNews() {
        return this.golfService.getNews();
    }

    @Get('news/trending')
    async getTrendingNews() {
        return this.golfService.getTrendingNews();
    }

    @Get('news/:id')
    async getNewsById(@Param('id') id: string) {
        return this.golfService.getNewsById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('news')
    async createNews(@Body() body, @Request() req) {
        // We might want to link it to the current user as author, but for now lets assume author details are managed separately or simplified
        // The service expects authorId, so we might need a default author or create one for the user
        // For simplicity, let's just pass body.authorId or a default
        const authorId = 'staff'; // Default staff author for now
        return this.golfService.createNews({ ...body, authorId });
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('news/:id')
    async updateNews(@Param('id') id: string, @Body() body) {
        return this.golfService.updateNews(id, body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('news/:id')
    async deleteNews(@Param('id') id: string) {
        return this.golfService.deleteNews(id);
    }
}
