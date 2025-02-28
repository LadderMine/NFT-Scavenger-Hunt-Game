import { Injectable } from '@nestjs/common';

@Injectable()
export class ModeratorService {
  async moderateContent(
    content: string,
  ): Promise<{ isAllowed: boolean; isFlagged: boolean; reason?: string }> {
    const forbiddenWords = ['badword1', 'badword2', 'badword3'];
    const flaggedWords = ['flag1', 'flag2', 'flag3'];

    const lowerContent = content.toLowerCase();

    for (const word of forbiddenWords) {
      if (lowerContent.includes(word)) {
        return {
          isAllowed: false,
          isFlagged: true,
          reason: 'Content contains forbidden words',
        };
      }
    }

    for (const word of flaggedWords) {
      if (lowerContent.includes(word)) {
        return {
          isAllowed: true,
          isFlagged: true,
          reason: 'Content contains flagged words',
        };
      }
    }

    return { isAllowed: true, isFlagged: false };
  }
}
