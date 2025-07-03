import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from './hint.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HintService {
  constructor(
    @InjectRepository(Hint)
    private hintRepository: Repository<Hint>,
  ) {}

  async create(data: Partial<Hint>) {
    const hint = this.hintRepository.create(data);
    return this.hintRepository.save(hint);
  }

  async getAvailableHints(
    puzzleId: string,
    elapsedMinutes: number,
  ): Promise<Hint[]> {
    const hints = await this.hintRepository.find({
      where: { puzzleId },
      order: { unlockTimeInMinutes: 'ASC' },
    });

    return hints.filter((hint) => hint.unlockTimeInMinutes <= elapsedMinutes);
  }
}
