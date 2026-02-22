import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 15 * 1024 * 1024, // 15MB max
        },
        fileFilter: (_req, file, callback) => {
            const allowedMimes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
            ];
            if (!allowedMimes.includes(file.mimetype)) {
                return callback(
                    new BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed'),
                    false,
                );
            }
            callback(null, true);
        },
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        const url = await this.uploadService.uploadFile(file);
        return { url };
    }

    @Post('profile')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB max for profile pics
        },
        fileFilter: (_req, file, callback) => {
            const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedMimes.includes(file.mimetype)) {
                return callback(
                    new BadRequestException('Only JPEG, PNG, and WebP images are allowed'),
                    false,
                );
            }
            callback(null, true);
        },
    }))
    async uploadProfilePic(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        const url = await this.uploadService.uploadFile(file);
        return { url };
    }
}
