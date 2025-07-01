import { Module } from '@nestjs/common';
import { NFTClaimController } from './nft-claim.controller';
import { NFTClaimService } from './nft-claim.service';
import { StarkNetHandlerService } from './providers/starknet-handler.service';

@Module({
  controllers: [NFTClaimController],
  providers: [NFTClaimService, StarkNetHandlerService],
  exports: [NFTClaimService],
})
export class NFTClaimModule {} 