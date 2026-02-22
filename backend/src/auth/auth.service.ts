import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                onboardingCompleted: user.onboardingCompleted ?? false,
            }
        };
    }

    async completeOnboarding(userId: string, preferredCategories: string[], playerIds: string[]) {
        // Save preferred categories as JSON string
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                preferredCategories: JSON.stringify(preferredCategories),
                onboardingCompleted: true,
                followedPlayers: playerIds.length > 0
                    ? { connect: playerIds.map(id => ({ id })) }
                    : undefined,
            },
        });
        return { success: true };
    }

    async getFullProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { followedPlayers: true }
        });
        if (!user) throw new UnauthorizedException('User not found');
        const { password, ...result } = user;
        return result;
    }

    async updateProfile(userId: string, data: { name?: string; image?: string }) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                image: data.image,
            },
        });
        const { password, ...result } = user;
        return result;
    }

    async deleteAccount(userId: string) {
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return { message: 'Account deleted successfully' };
    }

    async forgotPassword(email: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return true;
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setHours(expires.getHours() + 1);

            await this.prisma.user.update({
                where: { email },
                data: {
                    resetToken: token,
                    resetTokenExpires: expires,
                },
            });

            // WE MUST AWAIT THIS TO ENSURE IT COMPLETES
            await this.emailService.sendPasswordResetEmail(email, token);

            return true;
        } catch (error) {
            console.error('CRITICAL ERROR in forgotPassword process:', error);
            return true; // We still return true to avoid email enumeration
        }
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() },
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        return { message: 'Password has been reset successfully' };
    }

    async register(data: RegisterDto) {
        let allowRegistration = process.env.ALLOW_REGISTRATION !== 'false';

        const setting = await this.prisma.setting.findUnique({
            where: { key: 'allow_registration' }
        });

        if (setting) {
            allowRegistration = setting.value === 'true';
        }

        if (!allowRegistration) {
            throw new UnauthorizedException('Registration is currently disabled. Contact an administrator.');
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                },
            });
            const { password, ...safeUser } = user;
            return this.login(safeUser);
        } catch (e) {
            throw new UnauthorizedException('User already exists');
        }
    }
}
