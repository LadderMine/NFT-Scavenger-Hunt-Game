import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { StripeTransaction } from './stripe.entity';

@Injectable()
export class ReportingService {
  async generateReport() {
    const transactionRepository = getRepository(StripeTransaction);
    const transactions = await transactionRepository.find();
    // Generate a report based on transactions
    return transactions;
  }
}
