import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from 'src/level/entities/level.entity';
import { Puzzles } from './puzzles.entity';
import { CreatePuzzleDto } from './dtos/createPuzzles.dto';
import { Hints } from 'src/hints/hints.entity';
import { HintsService } from 'src/hints/hints.service';
import { CreateHintDto } from 'src/hints/dto/create-hints.dto';

@Injectable()
export class PuzzlesService {
  constructor(
    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>,
    private readonly levelRepository: Repository<Level>,
    private readonly hintsService: HintsService
  ) {}

  async create(createPuzzleDto: CreatePuzzleDto) {
    const level = await this.levelRepository.findOne({
        where: { name: createPuzzleDto.level }
    });
    if (!level) {
      throw new BadRequestException("Invalid level");
    }

    const data = { ...createPuzzleDto, level }
    const puzzle = this.puzzleRepository.create(data);
    const savedPuzzle = await this.puzzleRepository.save(puzzle);

    if (createPuzzleDto.hints?.length > 0) {
        const hints: Hints[] = await Promise.all(
            createPuzzleDto.hints.map(async (hintDto: CreateHintDto) => {
                return this.hintsService.createHint({
                    ...hintDto,
                    puzzleId: savedPuzzle.id
                });
            })
        );
        savedPuzzle.hints = hints;
    }

    return savedPuzzle;
  }
}
