import { Module } from '@nestjs/common';
import { GolfController } from './golf.controller';
import { GolfService } from './golf.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [GolfController],
    providers: [GolfService, PrismaService],
})
export class GolfModule { }
