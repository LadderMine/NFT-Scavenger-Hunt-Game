import { 
  Controller, Post, Body, Get, Query, Param, Patch, Delete, 
  BadRequestException, NotFoundException, ParseIntPipe, InternalServerErrorException, 
  ValidationPipe 
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CheckAnswerDto } from './dto/check-answer.dto';
import { CreateAnswerDto, UpdateAnswerDto } from './answers.dto';
import { Answer } from './answers.entity';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // Check if an answer is correct
  @Post('check')
  async checkAnswer(
    @Body(ValidationPipe) checkAnswerDto: CheckAnswerDto,
  ): Promise<{ isCorrect: boolean }> {
    const isCorrect = await this.answersService.checkAnswer(checkAnswerDto);
    return { isCorrect };
  }

  // Create a new answer
  @Post()
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    try {
      return await this.answersService.create(createAnswerDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Get all answers with pagination
  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    try {
      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new BadRequestException('Page and limit must be positive numbers');
      }

      return await this.answersService.findAll(pageNum, limitNum);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Get a single answer by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.answersService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  // Update an existing answer
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAnswerDto: UpdateAnswerDto) {
    try {
      return await this.answersService.update(id, updateAnswerDto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  // Delete an answer by ID
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      await this.answersService.delete(id);
      return { message: 'Answer deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }


  @Get(':field/:value')
  async findOneBy(
    @Param('field') field: string,
    @Param('value') value: any,
  ): Promise<Answer> {
    try{
    const result =  this.answersService.findOneBy(field, value);
    return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('id/:id')
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<Answer> {
    try{
      const result = this.answersService.findOneBy('id', id);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('text')
  async findOneByText(@Query('text') text: string): Promise<Answer> {
    try{
      const result =  this.answersService.findOneBy('text', text);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  };

}