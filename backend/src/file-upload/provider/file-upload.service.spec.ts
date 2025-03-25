// src/file-upload/file-upload.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';
import { Repository } from 'typeorm';
import { LocalFileStorageService } from './local.file.storage.service';
import { S3FileStorageService } from './s3.file.storage.service';

// Mock implementations of the repository and services
const mockFilesRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

const mockLocalFileStorageService = () => ({
  uploadFile: jest.fn(),
  getFileUrl: jest.fn(),
  deleteFile: jest.fn(),
});

const mockS3FileStorageService = () => ({
  uploadFile: jest.fn(),
  getFileUrl: jest.fn(),
  deleteFile: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn().mockImplementation((key) => {
    if (key === 'DEFAULT_STORAGE') return 'local';
    return null;
  }),
});

describe('FileUploadService', () => {
  let service: FileUploadService;
  let filesRepository: Repository<File>;
  let localFileStorageService: LocalFileStorageService;
  let s3FileStorageService: S3FileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        { provide: getRepositoryToken(File), useFactory: mockFilesRepository },
        { provide: LocalFileStorageService, useFactory: mockLocalFileStorageService },
        { provide: S3FileStorageService, useFactory: mockS3FileStorageService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    filesRepository = module.get<Repository<File>>(getRepositoryToken(File));
    localFileStorageService = module.get<LocalFileStorageService>(LocalFileStorageService);
    s3FileStorageService = module.get<S3FileStorageService>(S3FileStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});