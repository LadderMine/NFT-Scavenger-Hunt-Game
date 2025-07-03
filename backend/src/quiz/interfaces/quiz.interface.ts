export interface QuizSubmission {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuizResult {
  quizId: string;
  totalQuestions: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  passed: boolean;
  timeTaken?: number;
  answers: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  question: string;
  selectedOptions: string[];
  correctOptions: string[];
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
  explanation?: string;
}

export interface QuizFilters {
  topic?: string;
  isActive?: boolean;
  randomize?: boolean;
  limit?: number;
}
