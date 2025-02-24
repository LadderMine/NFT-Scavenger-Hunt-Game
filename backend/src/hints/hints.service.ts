import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hints } from './hints.entity';
import { Repository } from 'typeorm';
import { CreateHintDto } from './dto/create-hints.dto';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Injectable()
export class HintsService {
    constructor(
    @InjectRepository(Hints)
    private readonly hintRepository: Repository<Hints>,
    private readonly puzzleService: PuzzlesService
) {}

async createHint(dto: CreateHintDto): Promise<Hints> {
    const { puzzleId, hintText, difficultyLevel } = dto;
    
if (!puzzleId || !hintText.trim()) {
    throw new BadRequestException('puzzleId and hintText are required');
    }
    const puzzles = await this.puzzleService.getAPuzzle(puzzleId);

    const hint = this.hintRepository.create({ puzzles, hintText, difficultyLevel });
    return await this.hintRepository.save(hint);
}
}
