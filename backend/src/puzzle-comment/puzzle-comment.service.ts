import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

export interface PuzzleComment {
  id: string;
  userId: string;
  puzzleId: string;
  commentText: string;
  timestamp: Date;
  isFlagged: boolean;
}

@Injectable()
export class PuzzleCommentService {
  private readonly logger = new Logger(PuzzleCommentService.name);

  private comments = new Map<string, PuzzleComment>();
  private commentCounter = 0;

  private userCommentTimestamps = new Map<string, Map<string, number[]>>(); // Map<userId, Map<puzzleId, [timestamp1, timestamp2, ...]>>

  private readonly RATE_LIMIT_COUNT = 3;
  private readonly RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor() {
    this.seedData();
  }

  private seedData(): void {
    this.logger.log('Seeding initial puzzle comment data...');
    this.createComment(
      'user1',
      'puzzle101',
      'Great puzzle, really enjoyed it!',
    );
    this.createComment('user2', 'puzzle101', 'A bit challenging, but fun!');
    this.createComment('user1', 'puzzle102', 'This one was tricky!');
    const flaggedComment = this.createComment(
      'user3',
      'puzzle101',
      'This comment is inappropriate.',
    );
    if (flaggedComment) {
      flaggedComment.isFlagged = true;
      this.comments.set(flaggedComment.id, flaggedComment);
    }
    this.logger.log(`Seeded ${this.comments.size} comments.`);
  }

  private checkRateLimit(userId: string, puzzleId: string): void {
    if (!this.userCommentTimestamps.has(userId)) {
      this.userCommentTimestamps.set(userId, new Map<string, number[]>());
    }
    const userPuzzles = this.userCommentTimestamps.get(userId);

    if (!userPuzzles.has(puzzleId)) {
      userPuzzles.set(puzzleId, []);
    }
    const timestamps = userPuzzles.get(puzzleId);

    const now = Date.now();
    const windowStart = now - this.RATE_LIMIT_WINDOW_MS;

    const recentTimestamps = timestamps.filter((ts) => ts > windowStart);

    if (recentTimestamps.length >= this.RATE_LIMIT_COUNT) {
      this.logger.warn(
        `Rate limit exceeded for user ${userId} on puzzle ${puzzleId}.`,
      );
      throw new ForbiddenException(
        `You can only post ${this.RATE_LIMIT_COUNT} comments per hour on this puzzle.`,
      );
    }

    timestamps.push(now);
    userPuzzles.set(puzzleId, timestamps);
  }

  createComment(
    userId: string,
    puzzleId: string,
    commentText: string,
  ): PuzzleComment {
    this.logger.log(
      `Attempting to create comment by user ${userId} on puzzle ${puzzleId}.`,
    );
    this.checkRateLimit(userId, puzzleId);

    if (!commentText || commentText.trim().length === 0) {
      throw new BadRequestException('Comment text cannot be empty.');
    }

    this.commentCounter++;
    const newComment: PuzzleComment = {
      id: `comment-${this.commentCounter}`,
      userId,
      puzzleId,
      commentText,
      timestamp: new Date(),
      isFlagged: false,
    };
    this.comments.set(newComment.id, newComment);
    this.logger.log(`Comment created: ${JSON.stringify(newComment)}`);
    return newComment;
  }

  getCommentsForPuzzle(puzzleId: string): PuzzleComment[] {
    this.logger.log(`Fetching comments for puzzle ${puzzleId}.`);
    return Array.from(this.comments.values()).filter(
      (comment) => comment.puzzleId === puzzleId,
    );
  }

  getFlaggedComments(): PuzzleComment[] {
    this.logger.log('Fetching all flagged comments.');
    return Array.from(this.comments.values()).filter(
      (comment) => comment.isFlagged,
    );
  }

  flagComment(commentId: string, isAdmin: boolean): PuzzleComment {
    if (!isAdmin) {
      throw new ForbiddenException('Only administrators can flag comments.');
    }
    this.logger.log(`Attempting to flag comment ${commentId}.`);
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found.`);
    }
    comment.isFlagged = true;
    this.comments.set(commentId, comment);
    this.logger.log(`Comment ${commentId} flagged.`);
    return comment;
  }

  unflagComment(commentId: string, isAdmin: boolean): PuzzleComment {
    if (!isAdmin) {
      throw new ForbiddenException('Only administrators can unflag comments.');
    }
    this.logger.log(`Attempting to unflag comment ${commentId}.`);
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found.`);
    }
    comment.isFlagged = false;
    this.comments.set(commentId, comment);
    this.logger.log(`Comment ${commentId} unflagged.`);
    return comment;
  }

  deleteComment(commentId: string, userId: string, isAdmin: boolean): void {
    this.logger.log(
      `Attempting to delete comment ${commentId} by user ${userId} (isAdmin: ${isAdmin}).`,
    );
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found.`);
    }

    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment.',
      );
    }

    this.comments.delete(commentId);
    this.logger.log(`Comment ${commentId} deleted.`);
  }
}
