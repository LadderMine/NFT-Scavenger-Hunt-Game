import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entities';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  // Create a new transaction
  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }

  // Get all transactions
  async getTransactions(userId?: number, startDate?: string, endDate?: string): Promise<Transaction[]> {
    const query = this.transactionRepository.createQueryBuilder('transaction');

    if (userId) query.andWhere('transaction.userId = :userId', { userId });
    if (startDate) query.andWhere('transaction.createdAt >= :startDate', { startDate });
    if (endDate) query.andWhere('transaction.createdAt <= :endDate', { endDate });

    return query.getMany();
  }

  // Update transaction status
  async updateTransactionStatus(transactionId: string, status: string): Promise<Transaction> {
    await this.transactionRepository.update(transactionId, { status });
    return this.transactionRepository.findOneBy({ transactionId });
  }
}
