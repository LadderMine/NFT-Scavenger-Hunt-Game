// src/file-upload/controllers/file-upload.controller.ts
import { 
    Controller, 
    Post, 
    Get, 
    Delete, 
    Param, 
    UseInterceptors, 
    UploadedFile,
    ParseUUIDPipe, 
    Query, 
    BadRequestException,
    MaxFileSizeValidator,
    FileTypeValidator,
    ParseFilePipe,
    Logger
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './provider/file-upload.service';
import { FileResponseDto } from './dtos/file.response.dto';
 
  
  @Controller('files')
  export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService,
        private readonly logger = new Logger(FileUploadController.name)
    ) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx)$/ }),
          ],
        }),
      ) file: Express.Multer.File,
      @Query('storage') storageType?: 'local' | 's3',
    ): Promise<FileResponseDto> {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      
      return this.fileUploadService.uploadFile(file, storageType);
    }
  
    @Get()
    public async findAll(): Promise<FileResponseDto[]> {
      return this.fileUploadService.findAll();
    }
  
    @Get(':id')
    public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<FileResponseDto> {
      return this.fileUploadService.findOne(id);
    }
  
    @Delete(':id')
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
      return this.fileUploadService.delete(id);
    }
  }