import { Controller, Get, Post, Put, Delete, Param, UseGuards, Req, Body, NotFoundException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }

    @Get()
    async getAllPlayers(@Req() req: any) {
        return this.playerService.getAllPlayers();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my-list')
    async getPlayersForUser(@Req() req: any) {
        return this.playerService.getAllPlayers(req.user.id);
    }

    // IMPORTANT: Static routes MUST come before :id param route
    @UseGuards(AuthGuard('jwt'))
    @Get('my-feed')
    async getMyFeed(@Req() req: any) {
        return this.playerService.getMyFeed(req.user.id);
    }

    // Param route MUST be after all static routes to avoid intercepting them
    @Get(':id')
    async getPlayerById(@Param('id') id: string) {
        const player = await this.playerService.getPlayerById(id);
        if (!player) throw new NotFoundException('Player not found');
        return player;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('follow/:id')
    async followPlayer(@Req() req: any, @Param('id') id: string) {
        return this.playerService.followPlayer(req.user.id, id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('follow/:id')
    async unfollowPlayer(@Req() req: any, @Param('id') id: string) {
        return this.playerService.unfollowPlayer(req.user.id, id);
    }

    // Admin routing to create players
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    @Post()
    async createPlayer(@Body() data: { name: string; slug: string; image?: string }) {
        return this.playerService.createPlayer(data);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    @Put(':id')
    async updatePlayer(@Param('id') id: string, @Body() data: { name?: string; slug?: string; image?: string }) {
        return this.playerService.updatePlayer(id, data);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    @Delete(':id')
    async deletePlayer(@Param('id') id: string) {
        return this.playerService.deletePlayer(id);
    }
}
