import { Controller, Get, Param, Post, Put, Delete, Body, UseGuards, Request, Query } from '@nestjs/common';
import { GolfService } from './golf.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
    CreateNewsDto, UpdateNewsDto,
    CreateCategoryDto, UpdateCategoryDto,
    CreateSubTagDto, UpdateSubTagDto,
    UpdateUserRoleDto, UpdateSettingDto,
} from './dto/golf.dto';
import { TrackActivityDto } from '../auth/dto/auth.dto';

@Controller('golf')
export class GolfController {
    constructor(private readonly golfService: GolfService) { }

    // ── Public Endpoints ────────────────────────────────────────

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

    @Get('search')
    async search(@Query('q') query: string) {
        return this.golfService.search(query);
    }

    @Get('news')
    async getNews(
        @Query('category') category?: string,
        @Query('tag') tag?: string,
        @Query('status') status?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('excludeCategories') excludeCategories?: string,
        @Query('search') search?: string,
    ) {
        // Cap take at 100 to prevent database dumps
        const parsedTake = take ? Math.min(parseInt(take, 10), 100) : undefined;
        return this.golfService.getNews(
            category,
            tag,
            status,
            skip ? parseInt(skip, 10) : 0,
            parsedTake,
            excludeCategories ? excludeCategories.split(',') : undefined,
            search,
        );
    }

    @Get('news/trending')
    async getTrendingNews() {
        return this.golfService.getTrendingNews();
    }

    @Get('news/:id')
    async getNewsById(@Param('id') id: string) {
        return this.golfService.getNewsById(id);
    }

    @Get('categories')
    async getCategories() {
        return this.golfService.getCategories();
    }

    @Get('sub-tags')
    async getSubTags(@Query('categoryId') categoryId?: string) {
        return this.golfService.getSubTags(categoryId);
    }

    @Get('settings')
    async getSettings() {
        return this.golfService.getSettings();
    }

    @Get('maintenance-status')
    async getMaintenanceStatus() {
        return this.golfService.getMaintenanceStatus();
    }

    @Post('track-activity')
    async trackActivity(@Body() body: TrackActivityDto) {
        return this.golfService.trackActivity(body.visitorId, body.userId);
    }

    // ── Protected Endpoints (Authenticated + ADMIN/EDITOR role) ──

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    @Post('news')
    async createNews(@Body() body: CreateNewsDto) {
        return this.golfService.createNews({ ...body });
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    @Put('news/:id')
    async updateNews(@Param('id') id: string, @Body() body: UpdateNewsDto) {
        return this.golfService.updateNews(id, body);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    @Delete('news/:id')
    async deleteNews(@Param('id') id: string) {
        return this.golfService.deleteNews(id);
    }

    // ── Category Management (ADMIN only) ────────────────────────

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Post('categories')
    async createCategory(@Body() body: CreateCategoryDto) {
        return this.golfService.createCategory(body);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Put('categories/:id')
    async updateCategory(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
        return this.golfService.updateCategory(id, body);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Delete('categories/:id')
    async deleteCategory(@Param('id') id: string) {
        return this.golfService.deleteCategory(id);
    }

    // ── Sub-Tag Management (ADMIN only) ──────────────────────────

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Post('sub-tags')
    async createSubTag(@Body() body: CreateSubTagDto) {
        return this.golfService.createSubTag(body);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Put('sub-tags/:id')
    async updateSubTag(@Param('id') id: string, @Body() body: UpdateSubTagDto) {
        return this.golfService.updateSubTag(id, body);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Delete('sub-tags/:id')
    async deleteSubTag(@Param('id') id: string) {
        return this.golfService.deleteSubTag(id);
    }

    // ── Admin Dashboard & User Management (ADMIN only) ──────────

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Get('admin/stats')
    async getStats() {
        return this.golfService.getStats();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Get('admin/health')
    async getSystemHealth() {
        return this.golfService.getSystemHealth();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Get('admin/analytics')
    async getContentAnalytics() {
        return this.golfService.getContentAnalytics();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Get('admin/users')
    async getUsers() {
        return this.golfService.getUsers();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Put('admin/users/:id/role')
    async updateUserRole(@Param('id') id: string, @Body() body: UpdateUserRoleDto) {
        return this.golfService.updateUserRole(id, body.role as any);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Put('settings/:key')
    async updateSetting(@Param('key') key: string, @Body() body: UpdateSettingDto) {
        return this.golfService.updateSetting(key, body.value);
    }

}
