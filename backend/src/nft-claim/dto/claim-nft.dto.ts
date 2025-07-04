import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClaimNFTDto {
  @ApiProperty({ example: 'user123', description: 'Unique identifier of the user claiming the NFT' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'nft456', description: 'Unique identifier of the NFT to be claimed' })
  @IsString()
  @IsNotEmpty()
  nftId: string;
} 