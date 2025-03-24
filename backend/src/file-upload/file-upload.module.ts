
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { File } from './entities/file.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './provider/file-upload.service';
import { LocalFileStorageService } from './provider/local.file.storage.service';
import { S3FileStorageService } from './provider/s3.file.storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    }),
  ],
  controllers: [FileUploadController],
  providers: [
    FileUploadService, 
    LocalFileStorageService, 
    S3FileStorageService
  ],
  exports: [FileUploadService],
})
export class FileUploadModule {}