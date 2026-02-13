import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
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

    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 12);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    // role is NOT included — defaults to USER in the schema
                },
            });
            const { password, ...safeUser } = user;
            return this.login(safeUser);
        } catch (e) {
            throw new UnauthorizedException('User already exists');
        }
    }
}
