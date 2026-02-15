import { Controller, Post, UseGuards, Request, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { RegisterDto } from './dto/auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // Strict rate limit: max 5 login attempts per 60 seconds per IP
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(req.user);
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', result.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            domain: isProduction ? '.thegolfpress.com' : 'localhost',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        // Only return user info, NOT the token (prevents XSS token theft)
        return { user: result.user };
    }

    // Strict rate limit: max 3 registration attempts per 60 seconds per IP
    @Throttle({ default: { ttl: 60000, limit: 3 } })
    @Post('register')
    async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(body);
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', result.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            domain: isProduction ? '.thegolfpress.com' : 'localhost',
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
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            domain: isProduction ? '.thegolfpress.com' : 'localhost',
        });
        return { message: 'Logged out successfully' };
    }
}
