import { Controller, Post, Get, Patch, Body, Query, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entities';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Create a new transaction
  @Post()
  async createTransaction(@Body() transactionData: Partial<Transaction>): Promise<Transaction> {
    return this.transactionService.createTransaction(transactionData);
  }

  // Get all transactions
  @Get()
  async getTransactions(
    @Query('userId') userId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Transaction[]> {
    return this.transactionService.getTransactions(userId, startDate, endDate);
  }

  // Update transaction status
  @Patch(':transactionId/status')
  async updateTransactionStatus(
    @Param('transactionId') transactionId: string,
    @Body('status') status: string,
  ): Promise<Transaction> {
    return this.transactionService.updateTransactionStatus(transactionId, status);
  }
}
