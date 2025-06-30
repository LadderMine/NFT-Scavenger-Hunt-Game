import {
  Controller, Post, Get, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
// import { AdminAuthGuard } from '../auth/admin-auth.guard'; // Placeholder for admin guard

@ApiTags('Content')
@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // Public endpoints
  @Get('content')
  @ApiOperation({ summary: 'Get all active content (public)' })
  @ApiQuery({ name: 'topic', required: false, type: String, description: 'Filter content by topic' })
  @ApiResponse({ status: 200, description: 'List of active content.' })
  async findAll(@Query('topic') topic?: string) {
    if (topic) {
      return this.contentService.findAllByTopic(topic);
    }
    return this.contentService.findAll();
  }

  @Get('content/:id')
  @ApiOperation({ summary: 'Get content by ID (public)' })
  @ApiResponse({ status: 200, description: 'Content found.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  // Admin endpoints
  @Post('admin/content')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new content (admin)' })
  @ApiResponse({ status: 201, description: 'Content created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  // @UseGuards(AdminAuthGuard)
  async create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get('admin/content')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all content including inactive (admin)' })
  @ApiResponse({ status: 200, description: 'List of all content.' })
  // @UseGuards(AdminAuthGuard)
  async findAllAdmin() {
    return this.contentService.findAllAdmin();
  }

  @Get('admin/content/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content by ID including inactive (admin)' })
  @ApiResponse({ status: 200, description: 'Content found.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  // @UseGuards(AdminAuthGuard)
  async findOneAdmin(@Param('id') id: string) {
    return this.contentService.findOneAdmin(id);
  }

  @Patch('admin/content/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Content updated successfully.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  // @UseGuards(AdminAuthGuard)
  async updateAdmin(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.updateAdmin(id, updateContentDto);
  }

  @Delete('admin/content/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete content by ID (admin)' })
  @ApiResponse({ status: 204, description: 'Content deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  // @UseGuards(AdminAuthGuard)
  async removeAdmin(@Param('id') id: string) {
    return this.contentService.removeAdmin(id);
  }
} 