import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Puzzles } from './puzzles.entity';
import { Repository } from 'typeorm';
import { LevelService } from 'src/level/level.service';
import { NftsService } from 'src/nfts/nfts.service';
import { ScoresService } from 'src/scores/scores.service';

@Injectable()
export class PuzzlesService {
    constructor(
    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>,
    
    //define dependency injecction for level service
    private readonly levelService: LevelService,
    
      //define dependency injecction for NFTs service
    private readonly nftService: NftsService,

    //define dependency injecction for ScoresService
    private readonly scoresService: ScoresService
    ) {}


async getAPuzzle(id: number): Promise<Puzzles> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
    throw new NotFoundException(`Puzzle not found`);
    }
    return puzzle;
}
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Puzzles } from './puzzles.entity';
import { Repository } from 'typeorm';
import { LevelService } from 'src/level/level.service';
import { NftsService } from 'src/nfts/nfts.service';
import { ScoresService } from 'src/scores/scores.service';

@Injectable()
export class PuzzlesService {
    constructor(
    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>,
    
    //define dependency injecction for level service
    private readonly levelService: LevelService,
    
      //define dependency injecction for NFTs service
    private readonly nftService: NftsService,

    //define dependency injecction for ScoresService
    private readonly scoresService: ScoresService
    ) {}


async getAPuzzle(id: number): Promise<Puzzles> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
    throw new NotFoundException(`Puzzle not found`);
    }
    return puzzle;
}
}
