import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger"
import type { ImageService } from "../services/image.service"
import { UpdateImageDto } from "../dto/update-image.dto"
import { ProcessImageDto, BatchProcessImageDto } from "../dto/process-image.dto"
import type { ImageQueryDto } from "../dto/image-query.dto"
import type { Image } from "../entities/image.entity"
import type { Express } from "express"

@ApiTags("images")
@Controller("images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<Image> {
    return this.imageService.uploadImage(file);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Upload multiple images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]): Promise<Image[]> {
    const results = [];
    for (const file of files) {
      const image = await this.imageService.uploadImage(file);
      results.push(image);
    }
    return results;
  }

  @Get()
  @ApiOperation({ summary: 'Get all images' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'format', required: false, enum: ['jpeg', 'png', 'webp', 'gif'] })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'processing', 'completed', 'failed'] })
  @ApiQuery({ name: 'isOptimized', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Return all images' })
  async findAll(@Query() query: ImageQueryDto): Promise<{ items: Image[]; total: number; page: number; limit: number }> {
    return this.imageService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by ID' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Return the image' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Image> {
    return this.imageService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update image metadata" })
  @ApiParam({ name: "id", description: "Image ID" })
  @ApiBody({ type: UpdateImageDto })
  @ApiResponse({ status: 200, description: "Image updated successfully" })
  @ApiResponse({ status: 404, description: "Image not found" })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateImageDto: UpdateImageDto): Promise<Image> {
    return this.imageService.update(id, updateImageDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.imageService.remove(id);
  }

  @Post('process')
  @ApiOperation({ summary: 'Process an image (resize, crop, optimize)' })
  @ApiBody({ type: ProcessImageDto })
  @ApiResponse({ status: 200, description: 'Image processed successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async processImage(@Body() processImageDto: ProcessImageDto): Promise<Image> {
    return this.imageService.processImage(processImageDto);
  }

  @Post('batch-process')
  @ApiOperation({ summary: 'Process multiple images in batch' })
  @ApiBody({ type: BatchProcessImageDto })
  @ApiResponse({ status: 200, description: 'Images processed successfully' })
  async batchProcessImages(@Body() batchProcessDto: BatchProcessImageDto): Promise<Image[]> {
    return this.imageService.batchProcessImages(batchProcessDto);
  }

  @Post(":id/optimize")
  @ApiOperation({ summary: "Optimize an image" })
  @ApiParam({ name: "id", description: "Image ID" })
  @ApiQuery({ name: "quality", required: false, type: Number, description: "Quality (1-100)" })
  @ApiResponse({ status: 200, description: "Image optimized successfully" })
  @ApiResponse({ status: 404, description: "Image not found" })
  async optimizeImage(@Param('id', ParseUUIDPipe) id: string, @Query('quality') quality?: number): Promise<Image> {
    return this.imageService.optimizeImage(id, quality)
  }
}

