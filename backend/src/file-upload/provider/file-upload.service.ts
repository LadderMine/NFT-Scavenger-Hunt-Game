// src/file-upload/file-upload.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LocalFileStorageService } from './local.file.storage.service';
import { S3FileStorageService } from './s3.file.storage.service';
import { CreateFileDto } from '../dtos/create.file.dto';
import { FileResponseDto } from '../dtos/file.response.dto';
import { File } from '../entities/file.entity';


@Injectable()
export class FileUploadService {
  private defaultStorageService: 'local' | 's3';

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private localFileStorage: LocalFileStorageService,
    private s3FileStorage: S3FileStorageService,
    private configService: ConfigService,
  ) {
    this.defaultStorageService = this.configService.get('DEFAULT_STORAGE') || 'local';
  }

  private getStorageService(type: string) {
    if (type === 's3') {
      return this.s3FileStorage;
    }
    return this.localFileStorage;
  }

  public async uploadFile(file: Express.Multer.File, storageType?: 'local' | 's3'): Promise<FileResponseDto> {
    const type = storageType || this.defaultStorageService;
    const storageService = this.getStorageService(type);
    
    const fileData = await storageService.uploadFile(file);
    const createFileDto: CreateFileDto = {
      filename: fileData.filename,
      path: fileData.path,
      mimetype: fileData.mimetype,
      size: fileData.size,
      originalName: fileData.originalName,
      storageType: type,
    };
    
    const savedFile = await this.filesRepository.save(createFileDto);
    
    return this.mapToResponseDto(savedFile);
  }

  public async findAll(): Promise<FileResponseDto[]> {
    const files = await this.filesRepository.find();
    return files.map(file => this.mapToResponseDto(file));
  }

  public async findOne(id: string): Promise<FileResponseDto> {
    const file = await this.filesRepository.findOne({ where: { id } });
    
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    
    return this.mapToResponseDto(file);
  }

  public async delete(id: string): Promise<void> {
    const file = await this.filesRepository.findOne({ where: { id } });
    
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    
    const storageService = this.getStorageService(file.storageType);
    await storageService.deleteFile(file.path);
    
    await this.filesRepository.remove(file);
  }

  private mapToResponseDto(file: File): FileResponseDto {
    const storageService = this.getStorageService(file.storageType);
    const url = storageService.getFileUrl(file.path);
    
    return {
      id: file.id,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      originalName: file.originalName,
      createdAt: file.createdAt,
      url,
    };
  }
}