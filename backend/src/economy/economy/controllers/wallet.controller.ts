import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common"
import type { WalletService } from "../services/wallet.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { WalletResponseDto } from "../dto/wallet-response.dto"

@Controller("wallets")
@UseInterceptors(ClassSerializerInterceptor)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWallet(@Request() req) {
    const wallet = await this.walletService.createWallet(req.user.id);
    return new WalletResponseDto(wallet);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserWallets(@Request() req) {
    const wallets = await this.walletService.findWalletsByUserId(req.user.id);
    return wallets.map(wallet => new WalletResponseDto(wallet));
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getWallet(@Param('id') id: string, @Request() req) {
    const wallet = await this.walletService.findWalletById(id)

    // Ensure user can only access their own wallets
    if (wallet.userId !== req.user.id) {
      throw new Error("Unauthorized access to wallet")
    }

    return new WalletResponseDto(wallet)
  }
}

