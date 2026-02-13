import { Controller, Post, UseGuards, Request, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(req.user);
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', result.access_token, {
            httpOnly: true,
            secure: isProduction,       // true in production (HTTPS only)
            sameSite: isProduction ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Only return user info, NOT the token (prevents XSS token theft)
        return { user: result.user };
    }

    @Post('register')
    async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(body);
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', result.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { user: result.user };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        });
        return { message: 'Logged out successfully' };
    }
}
