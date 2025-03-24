import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from './file.storage.interface';

@Injectable()
export class LocalFileStorageService implements FileStorageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('FILE_UPLOAD_PATH') || 'uploads';
    this.baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async uploadFile(file: Express.Multer.File) {
    const filename = `${Date.now()}-${path.basename(file.originalname)}`;
    const filePath = path.join(this.uploadDir, filename);
    
    return new Promise<any>((resolve, reject) => {
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          filename,
          path: filePath,
          mimetype: file.mimetype,
          size: file.size,
          originalName: file.originalname,
          storageType: 'local',
        });
      });
    });
  }

  getFileUrl(path: string): string {
    // Convert internal path to public URL
    const relativePath = path.replace(this.uploadDir, '').replace(/\\/g, '/');
    return `${this.baseUrl}/uploads${relativePath}`;
  }

  public async deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}