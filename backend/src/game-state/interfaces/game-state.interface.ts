export interface GameState {
  playerId: number;
  sessionId: string;
  currentPuzzleId?: number;
  currentLevelId?: string;
  puzzleProgress: PuzzleProgress[];
  timerState: TimerState;
  hintsUsed: HintUsage[];
  score: number;
  lastActivity: Date;
  gameStatus: GameStatus;
  metadata: Record<string, any>;
}

export interface PuzzleProgress {
  puzzleId: number;
  levelId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  attempts: number;
  timeSpent: number; // in seconds
  hintsUsed: number;
  score?: number;
}

export interface TimerState {
  isActive: boolean;
  startTime?: Date;
  pausedTime?: Date;
  totalElapsed: number; // in seconds
  remainingTime?: number; // for timed puzzles
}

export interface HintUsage {
  hintId: number;
  puzzleId: number;
  usedAt: Date;
  hintText: string;
}

export enum GameStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}