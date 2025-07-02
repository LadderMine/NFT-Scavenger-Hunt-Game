import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { StarkNetHandlerService } from './providers/starknet-handler.service';
import { ClaimNFTDto } from './dto/claim-nft.dto';

@Injectable()
export class NFTClaimService {
  private readonly logger = new Logger(NFTClaimService.name);
  private readonly maxRetries = 3;
  private readonly retryDelayMs = 2000;

  constructor(private readonly starkNetHandler: StarkNetHandlerService) {}

  async claimNFT(claimNFTDto: ClaimNFTDto): Promise<any> {
    this.logger.log(`Processing NFT claim for user: ${claimNFTDto.userId}`);
    let attempt = 1;

    while (attempt <= this.maxRetries) {
      try {
        const result = await this.starkNetHandler.claimNFT(claimNFTDto);
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