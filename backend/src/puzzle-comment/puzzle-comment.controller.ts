import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { PuzzleCommentService, PuzzleComment } from './puzzle-comment.service';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  puzzleId: string;

  @IsNotEmpty()
  @IsString()
  commentText: string;
}

class AdminActionDto {
  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;
}

@Controller('puzzle-comments')
export class PuzzleCommentController {
  private readonly logger = new Logger(PuzzleCommentController.name);

  constructor(private readonly puzzleCommentService: PuzzleCommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createComment(@Body() createCommentDto: CreateCommentDto): PuzzleComment {
    this.logger.log(
      `Received request to create comment: ${JSON.stringify(createCommentDto)}`,
    );
    const { userId, puzzleId, commentText } = createCommentDto;
    return this.puzzleCommentService.createComment(
      userId,
      puzzleId,
      commentText,
    );
  }

  @Get('puzzle/:puzzleId')
  getCommentsForPuzzle(@Param('puzzleId') puzzleId: string): PuzzleComment[] {
    this.logger.log(`Received request for comments on puzzle ${puzzleId}.`);
    return this.puzzleCommentService.getCommentsForPuzzle(puzzleId);
  }

  @Get('flagged')
  getFlaggedComments(): PuzzleComment[] {
    this.logger.log('Received request for flagged comments.');
    return this.puzzleCommentService.getFlaggedComments();
  }

  @Put(':commentId/flag')
  flagComment(
    @Param('commentId') commentId: string,
    @Body() adminActionDto: AdminActionDto,
  ): PuzzleComment {
    this.logger.log(
      `Received request to flag comment ${commentId} (isAdmin: ${adminActionDto.isAdmin}).`,
    );
    return this.puzzleCommentService.flagComment(
      commentId,
      adminActionDto.isAdmin,
    );
  }

  @Put(':commentId/unflag')
  unflagComment(
    @Param('commentId') commentId: string,
    @Body() adminActionDto: AdminActionDto,
  ): PuzzleComment {
    this.logger.log(
      `Received request to unflag comment ${commentId} (isAdmin: ${adminActionDto.isAdmin}).`,
    );
    return this.puzzleCommentService.unflagComment(
      commentId,
      adminActionDto.isAdmin,
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(
    @Param('commentId') commentId: string,
    @Query('userId') userId: string,
    @Query('isAdmin') isAdminString: string,
  ): void {
    const isAdmin = isAdminString === 'true';
    this.logger.log(
      `Received request to delete comment ${commentId} by user ${userId} (isAdmin: ${isAdmin}).`,
    );
    this.puzzleCommentService.deleteComment(commentId, userId, isAdmin);
  }
}
