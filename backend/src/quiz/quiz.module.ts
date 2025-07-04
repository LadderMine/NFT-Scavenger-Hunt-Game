import { Module } from '@nestjs/common';
import { QuizService } from './services/quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizOption } from './entities/quiz-option.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizController } from './controllers/quiz.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuizOption, QuizQuestion, Quiz])],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService, TypeOrmModule],
})
export class QuizModule {}
