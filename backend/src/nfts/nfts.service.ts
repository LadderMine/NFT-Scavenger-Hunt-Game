import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NFTs } from './nfts.entity';
import { CreateNFTDto, UpdateNFTDto } from './nft.dto';
import { Puzzles } from 'src/puzzles/puzzles.entity';

@Injectable()
export class NFTsService {
  constructor(
    @InjectRepository(NFTs)
    private readonly nftsRepository: Repository<NFTs>,
    @InjectRepository(Puzzles)
    private readonly puzzlesRepository: Repository<Puzzles>,
  ) {}

  async create(createNFTDto: CreateNFTDto): Promise<NFTs> {
    const puzzle = await this.puzzlesRepository.findOne({
      where: { id: createNFTDto.puzzlesId },
    });

    if (!puzzle) {
      throw new Error('Puzzle not found');
    }

    const nft = this.nftsRepository.create({ puzzles: puzzle });
    return this.nftsRepository.save(nft);
  }

  async update(id: number, updateNFTDto: UpdateNFTDto): Promise<NFTs> {
    const nft = await this.nftsRepository.findOne({ where: { id } });

    if (!nft) {
      throw new Error('NFT not found');
    }

    const puzzle = await this.puzzlesRepository.findOne({
      where: { id: updateNFTDto.puzzlesId },
    });

    if (!puzzle) {
      throw new Error('Puzzle not found');
    }

    nft.puzzles = puzzle;
    return this.nftsRepository.save(nft);
  }
}
