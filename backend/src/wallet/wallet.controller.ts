import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('link')
  @HttpCode(HttpStatus.CREATED)
  async linkWallet(@Body() body: { address: string }): Promise<Wallet> {
    return this.walletService.linkWallet(body.address);
  }

  @Post('verify-signature')
  async verifySignature(@Body() body: { address: string; signature: string; message: string }): Promise<{ valid: boolean }> {
    const valid = await this.walletService.verifySignature(body.address, body.signature, body.message);
    return { valid };
  }

  @Get('verify-signature')
  async verifySignatureGet(@Query('address') address: string, @Query('signature') signature: string, @Query('message') message: string): Promise<{ valid: boolean }> {
    const valid = await this.walletService.verifySignature(address, signature, message);
    return { valid };
  }
}
