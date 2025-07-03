import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  HttpStatus, 
  HttpException,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserReportCardService } from './user-report-card.service';
import { ReportCardDto, CreateReportCardDto } from './dto/report-card.dto';

@ApiTags('User Report Cards')
@Controller('users')
export class UserReportCardController {
  constructor(private readonly reportCardService: UserReportCardService) {}

  @Get(':id/report-card')
  @ApiOperation({ 
    summary: 'Get user report card',
    description: 'Retrieves the report card for a specific user, showing their progress in the NFT scavenger hunt'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Report card retrieved successfully',
    type: ReportCardDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User report card not found' 
  })
  async getUserReportCard(@Param('id') userId: string): Promise<ReportCardDto> {
    try {
      return await this.reportCardService.findByUserId(userId);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(
          `Report card for user ${userId} not found. This user may not have started the scavenger hunt yet.`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'An error occurred while retrieving the report card',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/report-card')
  @ApiOperation({ 
    summary: 'Create user report card',
    description: 'Creates a new report card for a user or returns existing one'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Report card created successfully',
    type: ReportCardDto 
  })
  async createUserReportCard(
    @Param('id') userId: string,
    @Body() createDto: Partial<CreateReportCardDto> = {}
  ): Promise<ReportCardDto> {
    const reportCardData: CreateReportCardDto = {
      userId,
      ...createDto,
    };
    
    return await this.reportCardService.createReportCard(reportCardData);
  }

  @Put(':id/report-card/progress')
  @ApiOperation({ 
    summary: 'Update user progress',
    description: 'Updates the progress statistics for a user\'s report card'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({ name: 'puzzles', required: false, description: 'Number of completed puzzles' })
  @ApiQuery({ name: 'rewards', required: false, description: 'Number of rewards earned' })
  @ApiResponse({ 
    status: 200, 
    description: 'Progress updated successfully',
    type: ReportCardDto 
  })
  async updateUserProgress(
    @Param('id') userId: string,
    @Query('puzzles') puzzlesCompleted?: number,
    @Query('rewards') rewardsEarned?: number,
  ): Promise<ReportCardDto> {
    return await this.reportCardService.updateProgress(
      userId,
      puzzlesCompleted ? Number(puzzlesCompleted) : undefined,
      rewardsEarned ? Number(rewardsEarned) : undefined,
    );
  }

  @Get('report-cards')
  @ApiOperation({ 
    summary: 'Get all report cards',
    description: 'Retrieves all user report cards for administrative purposes'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All report cards retrieved successfully',
    type: [ReportCardDto] 
  })
  async getAllReportCards(): Promise<ReportCardDto[]> {
    return await this.reportCardService.getAllReportCards();
  }
}