import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NFTClaimService } from './nft-claim.service';
import { ClaimNFTDto } from './dto/claim-nft.dto';

@ApiTags('NFT Claim')
@Controller('nft-claim')
export class NFTClaimController {
  constructor(private readonly nftClaimService: NFTClaimService) {}

  @Post('claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Claim an NFT' })
  @ApiResponse({ status: 200, description: 'NFT claimed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async claimNFT(@Body() claimNFTDto: ClaimNFTDto) {
    return this.nftClaimService.claimNFT(claimNFTDto);
  }
} 