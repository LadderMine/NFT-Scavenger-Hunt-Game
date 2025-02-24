import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hints } from './hints.entity';
import { Repository } from 'typeorm';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { CreateHintDto } from './dto/create-hints.dto';

@Injectable()
export class HintsService {
    constructor(
    @InjectRepository(Hints)
    private readonly hintRepository: Repository<Hints>,
    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>
) {}

async createHint(dto: CreateHintDto): Promise<Hints> {
    const { puzzleId, hintText, difficultyLevel } = dto;
    
    if (!puzzleId || !hintText.trim()) {
    throw new HttpException('puzzleId and hintText are required', HttpStatus.BAD_REQUEST);
    }
    
    const puzzles = await this.puzzleRepository.findOne({ where: { id: puzzleId } });
    if (!puzzles) {
    throw new HttpException('Puzzle not found', HttpStatus.NOT_FOUND);
    }

    const hint = this.hintRepository.create({ puzzles, hintText, difficultyLevel });
    return await this.hintRepository.save(hint);
}
}
