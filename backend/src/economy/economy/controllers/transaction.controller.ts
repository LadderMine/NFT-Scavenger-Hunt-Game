import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common"
import type { TransactionService } from "../services/transaction.service"
import type { WalletService } from "../services/wallet.service"
import type { CreateTransactionDto } from "../dto/create-transaction.dto"
import type { TransferDto } from "../dto/transfer.dto"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { TransactionResponseDto } from "../dto/transaction-response.dto"

@Controller("transactions")
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly walletService: WalletService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("wallet/:walletId")
  async createTransaction(
    @Param('walletId') walletId: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    // Verify wallet belongs to user
    const wallet = await this.walletService.findWalletById(walletId)
    if (wallet.userId !== req.user.id) {
      throw new Error("Unauthorized access to wallet")
    }

    const transaction = await this.transactionService.createTransaction(walletId, createTransactionDto)

    return new TransactionResponseDto(transaction)
  }

  @UseGuards(JwtAuthGuard)
  @Post("wallet/:walletId/transfer")
  async transferCurrency(@Param('walletId') walletId: string, @Body() transferDto: TransferDto, @Request() req) {
    // Verify wallet belongs to user
    const wallet = await this.walletService.findWalletById(walletId)
    if (wallet.userId !== req.user.id) {
      throw new Error("Unauthorized access to wallet")
    }

    const transactions = await this.transactionService.transferCurrency(walletId, transferDto)

    return transactions.map((transaction) => new TransactionResponseDto(transaction))
  }

  @UseGuards(JwtAuthGuard)
  @Get("wallet/:walletId")
  async getWalletTransactions(@Param('walletId') walletId: string, @Request() req) {
    // Verify wallet belongs to user
    const wallet = await this.walletService.findWalletById(walletId)
    if (wallet.userId !== req.user.id) {
      throw new Error("Unauthorized access to wallet")
    }

    const transactions = await this.transactionService.getTransactionsByWalletId(walletId)
    return transactions.map((transaction) => new TransactionResponseDto(transaction))
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getTransaction(@Param('id') id: string, @Request() req) {
    const transaction = await this.transactionService.getTransactionById(id)

    // Verify transaction belongs to user's wallet
    const wallet = await this.walletService.findWalletById(transaction.walletId)
    if (wallet.userId !== req.user.id) {
      throw new Error("Unauthorized access to transaction")
    }

    return new TransactionResponseDto(transaction)
  }
}

