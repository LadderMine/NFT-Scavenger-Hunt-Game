import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslationService {
  async translateText(text: string, targetLanguage: string): Promise<string> {
    console.log(`Translating: "${text}" to ${targetLanguage}`);
    return `Translated: ${text} (to ${targetLanguage})`;
  }

  async detectLanguage(text: string): Promise<string> {
    console.log(`Detecting language for: "${text}"`);
    return 'en';
  }
}
