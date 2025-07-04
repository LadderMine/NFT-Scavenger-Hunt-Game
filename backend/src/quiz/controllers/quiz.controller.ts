import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizResultDto } from '../dto/quiz-result.dto';
import { Quiz } from '../entities/quiz.entity';
import { QuizFilters } from '../interfaces/quiz.interface';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuiz(
    @Body(ValidationPipe) createQuizDto: CreateQuizDto,
  ): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Get()
  async getQuizzes(
    @Query('topic') topic?: string,
    @Query('active') active?: string,
    @Query('randomize') randomize?: string,
    @Query('limit') limit?: string,
  ): Promise<Quiz[]> {
    const filters: QuizFilters = {};

    if (topic) filters.topic = topic;
    if (active !== undefined) filters.isActive = active === 'true';
    if (randomize !== undefined) filters.randomize = randomize === 'true';
    if (limit) filters.limit = parseInt(limit, 10);

    return this.quizService.getQuizzes(filters);
  }

  @Get('topics')
  async getQuizTopics(): Promise<string[]> {
    return this.quizService.getQuizTopics();
  }

  @Get(':id')
  async getQuizById(@Param('id', ParseUUIDPipe) id: string): Promise<Quiz> {
    return this.quizService.getQuizById(id);
  }

  @Get(':id/take')
  async getQuizForTaking(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Quiz> {
    return this.quizService.getQuizForTaking(id);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitQuiz(
    @Body(ValidationPipe) submitQuizDto: SubmitQuizDto,
  ): Promise<QuizResultDto> {
    return this.quizService.submitQuiz(submitQuizDto);
  }

  @Put(':id/status')
  async updateQuizStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Quiz> {
    return this.quizService.updateQuizStatus(id, isActive);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuiz(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.quizService.deleteQuiz(id);
  }
}
