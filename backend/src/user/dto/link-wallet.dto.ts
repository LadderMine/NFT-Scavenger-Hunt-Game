import { IsString, Matches } from 'class-validator';

export class LinkWalletDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Wallet address must be a valid Ethereum address',
  })
  walletAddress: string;
}
