import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { FileStorageService } from './file.storage.interface';

@Injectable()
export class S3FileStorageService implements FileStorageService {
  private s3: S3;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
    
    this.bucket = this.configService.get('AWS_S3_BUCKET');
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: this.bucket,
      Key: `uploads/${filename}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    
    return {
      filename,
      path: result.Key,
      mimetype: file.mimetype,
      size: file.size,
      originalName: file.originalname,
      storageType: 's3',
    };
  }

  getFileUrl(path: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${path}`;
  }

  async deleteFile(path: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: path,
    }).promise();
  }
}