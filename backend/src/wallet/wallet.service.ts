import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async linkWallet(address: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({ where: { address } });
    if (!wallet) {
      wallet = this.walletRepository.create({ address });
      await this.walletRepository.save(wallet);
    }
    return wallet;
  }

  // Mock signature verification
  async verifySignature(address: string, signature: string, message: string): Promise<boolean> {
    // Stub: Always returns true for now
    return true;
  }

  async findByAddress(address: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { address } });
  }
}
