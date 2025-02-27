import { Body, Controller, Post } from '@nestjs/common';
import { AnswerDto } from '../dto/answer_dto'

@Controller('answers')
export class AnswersController {
    @Post()
    async create(@Body() AnswerDto: AnswerDto) {
        return { message: 'Answer created', data: AnswerDto};
    }
}
