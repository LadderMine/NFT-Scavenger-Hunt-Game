import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NFTs } from './nfts.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Injectable()

export class NftsService {
    constructor(
        @InjectRepository(NFTs)
        private nftRepository: Repository<NFTs>, //define repository injection for NFTs


        private readonly puzzleService: PuzzlesService
    ){}
}
