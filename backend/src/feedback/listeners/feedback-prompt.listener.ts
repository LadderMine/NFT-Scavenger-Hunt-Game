import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { ChallengeCompletedEvent } from '../../challenges/challenge-completion.service';

@Injectable()
export class FeedbackPromptListener {
  private readonly logger = new Logger(FeedbackPromptListener.name);

  @OnEvent('challenge.completed')
  async handleChallengeCompleted(
    event: ChallengeCompletedEvent,
  ): Promise<void> {
    this.logger.log(
      `Challenge completed by user ${event.userId}, prompting for feedback`,
    );

    await this.sendFeedbackPrompt(event);
  }

  private async sendFeedbackPrompt(
    event: ChallengeCompletedEvent,
  ): Promise<void> {
    const feedbackPrompt = {
      type: 'FEEDBACK_REQUEST',
      userId: event.userId,
      challengeId: event.challengeId,
      message:
        'How was your experience with this challenge? Your feedback helps us improve!',
      timestamp: new Date(),
    };

    // Send notification through your preferred method
    this.logger.log(`Feedback prompt sent for challenge ${event.challengeId}`);
  }
}
