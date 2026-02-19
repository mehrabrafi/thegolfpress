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
                role: user.role
            }
        };
    }

    async forgotPassword(email: string) {
        console.log('--- FORGOT PASSWORD PROCESS START ---');
        console.log('Email received:', email);

        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                console.log('NOTICE: User with this email does not exist in our database.');
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

            console.log('Database updated with reset token. Sending email now...');

            // WE MUST AWAIT THIS TO ENSURE IT COMPLETES
            const emailResult = await this.emailService.sendPasswordResetEmail(email, token);

            console.log('Email Status:', emailResult ? 'SUCCESS' : 'FAILED');
            console.log('--- FORGOT PASSWORD PROCESS END ---');
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
        const allowRegistration = process.env.ALLOW_REGISTRATION !== 'false';
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
