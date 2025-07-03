import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { QuizOption } from '../entities/quiz-option.entity';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizResultDto } from '../dto/quiz-result.dto';
import {
  QuizFilters,
  QuizResult,
  QuestionResult,
} from '../interfaces/quiz.interface';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizOption)
    private optionRepository: Repository<QuizOption>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizRepository.create({
      title: createQuizDto.title,
      description: createQuizDto.description,
      topic: createQuizDto.topic,
      timeLimit: createQuizDto.timeLimit || 60,
      passingScore: createQuizDto.passingScore || 0,
      randomizeQuestions: createQuizDto.randomizeQuestions || false,
      randomizeOptions: createQuizDto.randomizeOptions || false,
    });

    const savedQuiz = await this.quizRepository.save(quiz);

    // Create questions and options
    for (let i = 0; i < createQuizDto.questions.length; i++) {
      const questionDto = createQuizDto.questions[i];
      const question = this.questionRepository.create({
        question: questionDto.question,
        type: questionDto.type,
        points: questionDto.points || 1,
        order: questionDto.order || i,
        explanation: questionDto.explanation,
        isRequired: questionDto.isRequired !== false,
        quizId: savedQuiz.id,
      });

      const savedQuestion = await this.questionRepository.save(question);

      // Create options
      for (let j = 0; j < questionDto.options.length; j++) {
        const optionDto = questionDto.options[j];
        const option = this.optionRepository.create({
          text: optionDto.text,
          isCorrect: optionDto.isCorrect,
          order: optionDto.order || j,
          explanation: optionDto.explanation,
          questionId: savedQuestion.id,
        });

        await this.optionRepository.save(option);
      }
    }

    return this.getQuizById(savedQuiz.id);
  }

  async getQuizzes(filters: QuizFilters = {}): Promise<Quiz[]> {
    const queryBuilder = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .orderBy('quiz.createdAt', 'DESC')
      .addOrderBy('questions.order', 'ASC')
      .addOrderBy('options.order', 'ASC');

    if (filters.topic) {
      queryBuilder.andWhere('quiz.topic = :topic', { topic: filters.topic });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('quiz.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }

    const quizzes = await queryBuilder.getMany();

    if (filters.randomize) {
      return this.shuffleArray(quizzes);
    }

    return quizzes;
  }

  async getQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
      order: {
        questions: { order: 'ASC' },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    // Sort options by order
    quiz.questions.forEach((question) => {
      question.options.sort((a, b) => a.order - b.order);
    });

    return quiz;
  }

  async getQuizForTaking(id: string): Promise<Quiz> {
    const quiz = await this.getQuizById(id);

    if (!quiz.isActive) {
      throw new BadRequestException('Quiz is not currently active');
    }

    // Randomize questions if enabled
    if (quiz.randomizeQuestions) {
      quiz.questions = this.shuffleArray(quiz.questions);
    }

    // Randomize options if enabled
    if (quiz.randomizeOptions) {
      quiz.questions.forEach((question) => {
        question.options = this.shuffleArray(question.options);
      });
    }

    return quiz;
  }

  async submitQuiz(submitQuizDto: SubmitQuizDto): Promise<QuizResultDto> {
    const quiz = await this.getQuizById(submitQuizDto.quizId);

    if (!quiz.isActive) {
      throw new BadRequestException('Quiz is not currently active');
    }

    const result = await this.calculateQuizResult(quiz, submitQuizDto);

    return {
      quizId: quiz.id,
      quizTitle: quiz.title,
      totalQuestions: result.totalQuestions,
      totalPoints: result.totalPoints,
      earnedPoints: result.earnedPoints,
      percentage: result.percentage,
      passed: result.passed,
      timeTaken: submitQuizDto.timeTaken,
      answers: result.answers.map((answer) => ({
        questionId: answer.questionId,
        question: answer.question,
        selectedOptions: answer.selectedOptions,
        correctOptions: answer.correctOptions,
        isCorrect: answer.isCorrect,
        points: answer.points,
        earnedPoints: answer.earnedPoints,
        explanation: answer.explanation,
      })),
      completedAt: new Date(),
    };
  }

  private async calculateQuizResult(
    quiz: Quiz,
    submission: SubmitQuizDto,
  ): Promise<QuizResult> {
    let totalPoints = 0;
    let earnedPoints = 0;
    const answers: QuestionResult[] = [];

    for (const question of quiz.questions) {
      const submittedAnswer = submission.answers.find(
        (a) => a.questionId === question.id,
      );
      const correctOptions = question.options.filter((o) => o.isCorrect);
      const correctOptionIds = correctOptions.map((o) => o.id);

      totalPoints += question.points;

      let isCorrect = false;
      let questionPoints = 0;

      if (submittedAnswer) {
        // Check if the submitted answer is correct
        const selectedIds = submittedAnswer.selectedOptionIds.sort();
        const correctIds = correctOptionIds.sort();

        isCorrect = this.arraysEqual(selectedIds, correctIds);

        if (isCorrect) {
          questionPoints = question.points;
          earnedPoints += questionPoints;
        }
      }

      answers.push({
        questionId: question.id,
        question: question.question,
        selectedOptions: submittedAnswer
          ? question.options
              .filter((o) => submittedAnswer.selectedOptionIds.includes(o.id))
              .map((o) => o.text)
          : [],
        correctOptions: correctOptions.map((o) => o.text),
        isCorrect,
        points: question.points,
        earnedPoints: questionPoints,
        explanation: question.explanation,
      });
    }

    const percentage =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    return {
      quizId: quiz.id,
      totalQuestions: quiz.questions.length,
      totalPoints,
      earnedPoints,
      percentage,
      passed,
      timeTaken: submission.timeTaken,
      answers,
    };
  }

  async getQuizTopics(): Promise<string[]> {
    const result = await this.quizRepository
      .createQueryBuilder('quiz')
      .select('DISTINCT quiz.topic', 'topic')
      .where('quiz.topic IS NOT NULL')
      .andWhere('quiz.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result.map((r) => r.topic).filter(Boolean);
  }

  async updateQuizStatus(id: string, isActive: boolean): Promise<Quiz> {
    const quiz = await this.getQuizById(id);
    quiz.isActive = isActive;
    return this.quizRepository.save(quiz);
  }

  async deleteQuiz(id: string): Promise<void> {
    const quiz = await this.getQuizById(id);
    await this.quizRepository.remove(quiz);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }
}
