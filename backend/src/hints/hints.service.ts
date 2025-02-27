import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hints } from './hints.entity';
import { Repository } from 'typeorm';
import { CreateHintDto } from './dto/create-hints.dto';
import { UpdateHintDto } from './dto/update-hints.dto';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Injectable()
export class HintsService {
    constructor(
        // Repository injection of hint entity
        @InjectRepository(Hints)
        private readonly hintRepository: Repository<Hints>,

        // Dependency injection of puzzle service
        private readonly puzzleService: PuzzlesService
    ) {}

    async createHint(dto: CreateHintDto): Promise<Hints> {
        const { puzzleId, hintText, difficultyLevel } = dto;

        if (!puzzleId || !hintText.trim()) {
            throw new BadRequestException('puzzleId and hintText are required');
        }

        const puzzles = await this.puzzleService.getAPuzzle(String(puzzleId));
        const hint = this.hintRepository.create({ puzzles, hintText, difficultyLevel });

        return await this.hintRepository.save(hint);
    }

    async findById(id: string): Promise<Hints | null> {
        return await this.hintRepository.findOne({ where: { id: parseInt(id) } });
    }

    async updateHint(id: string, updateHintDto: UpdateHintDto): Promise<Hints> {
        const hint = await this.findById(id);
        if (!hint) {
            throw new NotFoundException('Hint not found');
        }

        Object.assign(hint, updateHintDto);
        return await this.hintRepository.save(hint);
    }

    async getHintForPuzzle(puzzleId: string): Promise<Hints | null> {
        const puzzle = await this.puzzleService.getAPuzzle(puzzleId);
        if (!puzzle) {
            throw new NotFoundException('Puzzle not found');
        }

        const hints = await this.hintRepository.find({
            where: { puzzles: puzzle },
        });

        if (hints.length === 0) {
            return null; // Will trigger 204 response in the controller
        }

        return hints[Math.floor(Math.random() * hints.length)]; // Randomly pick one hint
    }
}