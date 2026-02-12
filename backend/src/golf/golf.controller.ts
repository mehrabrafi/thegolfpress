import { Controller, Get, Param, Post, Put, Delete, Body, UseGuards, Request, Query } from '@nestjs/common';
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

    @Get('players/:id')
    async getPlayerProfile(@Param('id') id: string) {
        return this.golfService.getPlayerProfile(id);
    }

    @Get('news')
    async getNews(@Query('category') category?: string) {
        return this.golfService.getNews(category);
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
    async createNews(@Body() body) {
        // Enforce a unified website author instead of individual authors
        return this.golfService.createNews({ ...body });
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



    // Category Management
    @Get('categories')
    async getCategories() {
        return this.golfService.getCategories();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('categories')
    async createCategory(@Body() body) {
        return this.golfService.createCategory(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('categories/:id')
    async updateCategory(@Param('id') id: string, @Body() body) {
        return this.golfService.updateCategory(id, body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('categories/:id')
    async deleteCategory(@Param('id') id: string) {
        return this.golfService.deleteCategory(id);
    }

    // Sub-Tag Management
    @Get('sub-tags')
    async getSubTags(@Query('categoryId') categoryId?: string) {
        return this.golfService.getSubTags(categoryId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('sub-tags')
    async createSubTag(@Body() body) {
        return this.golfService.createSubTag(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('sub-tags/:id')
    async updateSubTag(@Param('id') id: string, @Body() body) {
        return this.golfService.updateSubTag(id, body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('sub-tags/:id')
    async deleteSubTag(@Param('id') id: string) {
        return this.golfService.deleteSubTag(id);
    }

    // Admin Dashboard & User Management
    @UseGuards(AuthGuard('jwt'))
    @Get('admin/stats')
    async getStats() {
        return this.golfService.getStats();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('admin/users')
    async getUsers() {
        return this.golfService.getUsers();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('admin/users/:id/role')
    async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
        return this.golfService.updateUserRole(id, role as any);
    }

    @Get('settings')
    async getSettings() {
        return this.golfService.getSettings();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('settings/:key')
    async updateSetting(@Param('key') key: string, @Body('value') value: string) {
        return this.golfService.updateSetting(key, value);
    }
}
