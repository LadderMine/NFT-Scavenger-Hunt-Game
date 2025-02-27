import { 
  Controller, Post, Body, Get, Query, Param, Patch, Delete, 
  BadRequestException, NotFoundException, InternalServerErrorException 
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto, UpdateAnswerDto } from './answers.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answerService: AnswersService) {}

  @Post()
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    try {
      return await this.answerService.create(createAnswerDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    try {
      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new BadRequestException('Page and limit must be positive numbers');
      }

      return await this.answerService.findAll(pageNum, limitNum);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.answerService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAnswerDto: UpdateAnswerDto) {
    try {
      return await this.answerService.update(id, updateAnswerDto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      await this.answerService.delete(id);
      return { message: 'Answer deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
