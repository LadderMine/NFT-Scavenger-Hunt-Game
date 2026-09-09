import { Injectable, Logger, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
import { StarkNetHandlerService } from './providers/starknet-handler.service';
import { ClaimNFTDto } from './dto/claim-nft.dto';

@Injectable()
export class NFTClaimService {
  private readonly logger = new Logger(NFTClaimService.name);
  private readonly maxRetries = 3;
  private readonly retryDelayMs = 2000;
  // Tracks NFTs already claimed per user so a repeat claim can be rejected
  // immediately with a clear error instead of retrying against StarkNet.
  private readonly claimedRewards = new Set<string>();

  constructor(private readonly starkNetHandler: StarkNetHandlerService) {}

  async claimNFT(claimNFTDto: ClaimNFTDto): Promise<any> {
    this.logger.log(`Processing NFT claim for user: ${claimNFTDto.userId}`);

    const claimKey = `${claimNFTDto.userId}:${claimNFTDto.nftId}`;
    if (this.claimedRewards.has(claimKey)) {
      this.logger.warn(`Duplicate claim attempt for user: ${claimNFTDto.userId}, NFT: ${claimNFTDto.nftId}`);
      throw new ConflictException(
        `NFT reward ${claimNFTDto.nftId} has already been claimed by user ${claimNFTDto.userId}`,
      );
    }

    let attempt = 1;

    while (attempt <= this.maxRetries) {
      try {
        const result = await this.starkNetHandler.claimNFT(claimNFTDto);
        this.claimedRewards.add(claimKey);
        this.logger.log(`NFT claim successful for user: ${claimNFTDto.userId} on attempt ${attempt}`);
        return result;
      } catch (error) {
        this.logger.error(`NFT claim failed for user: ${claimNFTDto.userId} on attempt ${attempt}, error: ${error.message}`);
        if (attempt === this.maxRetries) {
          this.logger.error(`Max retries reached for user: ${claimNFTDto.userId}. Claim failed.`);
          if (error instanceof BadRequestException) {
            throw error;
          } else {
            throw new InternalServerErrorException('Failed to claim NFT after maximum retries');
          }
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelayMs * Math.pow(2, attempt - 1)));
        attempt++;
      }
    }
  }
} 