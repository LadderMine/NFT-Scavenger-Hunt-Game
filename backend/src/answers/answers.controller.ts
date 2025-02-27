import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CheckAnswerDto } from './dto/check-answer.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post('check')
  async checkAnswer(
    @Body(ValidationPipe) checkAnswerDto: CheckAnswerDto,
  ): Promise<{ isCorrect: boolean }> {
    const isCorrect = await this.answersService.checkAnswer(checkAnswerDto);
    return { isCorrect };
  }
}
