import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly s3Client: S3Client;
    private readonly logger = new Logger(UploadService.name);

    constructor() {
        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
            },
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        try {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;
            const bucketName = process.env.R2_BUCKET_NAME;

            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    // ACL: 'public-read', // R2 doesn't always support ACLs depending on bucket settings, usually public access is managed via bucket policy or worker
                }),
            );

            const publicUrl = process.env.NEXT_PUBLIC_IMAGE_URL
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${fileName}`
                : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucketName}/${fileName}`; // Fallback, though usually not directly accessible

            return publicUrl;
        } catch (error) {
            this.logger.error('Error uploading file to R2', error);
            throw error;
        }
    }
}
