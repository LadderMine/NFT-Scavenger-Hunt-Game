import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResponseDto } from './dto/progress-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Progress')
@Controller('users')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get user progress' })
  @ApiResponse({ status: 200, description: 'Progress retrieved', type: ProgressResponseDto })
  @ApiResponse({ status: 404, description: 'User progress not found' })
  async getUserProgress(
    @Param('id', new ParseUUIDPipe()) userId: string,
  ): Promise<ProgressResponseDto> {
    return this.progressService.getProgressByUserId(userId);
  }
}
