import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { StoryService } from './story.service';
import { ChapterResponseDto } from './dto/chapter-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';

@ApiTags('story')
@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('chapters')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch available story chapters' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of available story chapters',
    type: [ChapterResponseDto],
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getChapters(userId: string): Promise<ChapterResponseDto[]> {
    return this.storyService.findAllChapters(userId);
  }

  @Get('chapter/:chapterId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details of a specific chapter' })
  @ApiParam({
    name: 'chapterId',
    description: 'The ID of the chapter to fetch',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the specified chapter',
    type: ChapterResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getChapterDetails(
    @Param('chapterId') chapterId: string,
  ): Promise<ChapterResponseDto> {
    return this.storyService.findChapterById(chapterId);
  }
}
