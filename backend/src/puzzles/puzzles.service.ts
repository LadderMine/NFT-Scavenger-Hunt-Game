import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Puzzles } from './puzzles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PuzzlesService {
    constructor(
    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>
    ) {}


async getAPuzzle(id: number): Promise<Puzzles> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
    throw new NotFoundException(`Puzzle not found`);
    }
    return puzzle;
}
}
