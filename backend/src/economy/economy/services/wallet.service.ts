import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Wallet } from "../entities/wallet.entity"
import { User } from "../../users/entities/user.entity"

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createWallet(userId: string): Promise<Wallet> {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    const wallet = this.walletRepository.create({
      user,
      userId,
      points: 0,
      tokens: 0,
    })

    return this.walletRepository.save(wallet)
  }

  async findWalletById(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { id } })

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`)
    }

    return wallet
  }

  async findWalletsByUserId(userId: string): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { userId } })
  }

  async updateWalletBalance(walletId: string, points?: number, tokens?: number): Promise<Wallet> {
    const wallet = await this.findWalletById(walletId)

    if (points !== undefined) {
      wallet.points = points
    }

    if (tokens !== undefined) {
      wallet.tokens = tokens
    }

    return this.walletRepository.save(wallet)
  }
}

