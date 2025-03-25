import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository, DataSource } from "typeorm"
import { Transaction, TransactionType, CurrencyType } from "../entities/transaction.entity"
import type { CreateTransactionDto } from "../dto/create-transaction.dto"
import type { TransferDto } from "../dto/transfer.dto"
import type { WalletService } from "./wallet.service"

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private walletService: WalletService,
    private dataSource: DataSource,
  ) {}

  async createTransaction(walletId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const wallet = await this.walletService.findWalletById(walletId)

      // Create the transaction
      const transaction = this.transactionRepository.create({
        ...dto,
        walletId,
      })

      // Update wallet balance based on transaction type
      if (dto.currencyType === CurrencyType.POINTS) {
        switch (dto.type) {
          case TransactionType.POINTS_EARNED:
            wallet.points += dto.amount
            break
          case TransactionType.POINTS_SPENT:
            if (wallet.points < dto.amount) {
              throw new BadRequestException("Insufficient points balance")
            }
            wallet.points -= dto.amount
            break
          default:
            break
        }
      } else if (dto.currencyType === CurrencyType.TOKENS) {
        switch (dto.type) {
          case TransactionType.TOKENS_PURCHASED:
            wallet.tokens += dto.amount
            break
          case TransactionType.TOKENS_SPENT:
            if (wallet.tokens < dto.amount) {
              throw new BadRequestException("Insufficient tokens balance")
            }
            wallet.tokens -= dto.amount
            break
          default:
            break
        }
      }

      // Save changes
      await queryRunner.manager.save(wallet)
      const savedTransaction = await queryRunner.manager.save(transaction)

      // Commit transaction
      await queryRunner.commitTransaction()

      return savedTransaction
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  async transferCurrency(walletId: string, transferDto: TransferDto): Promise<Transaction[]> {
    const { recipientWalletId, currencyType, amount, description } = transferDto

    if (walletId === recipientWalletId) {
      throw new BadRequestException("Cannot transfer to the same wallet")
    }

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Get sender and recipient wallets
      const senderWallet = await this.walletService.findWalletById(walletId)
      const recipientWallet = await this.walletService.findWalletById(recipientWalletId)

      // Check if sender has enough balance
      if (currencyType === CurrencyType.POINTS) {
        if (senderWallet.points < amount) {
          throw new BadRequestException("Insufficient points balance")
        }
        senderWallet.points -= amount
        recipientWallet.points += amount
      } else {
        if (senderWallet.tokens < amount) {
          throw new BadRequestException("Insufficient tokens balance")
        }
        senderWallet.tokens -= amount
        recipientWallet.tokens += amount
      }

      // Create sender transaction
      const senderTransaction = this.transactionRepository.create({
        type:
          currencyType === CurrencyType.POINTS
            ? TransactionType.POINTS_TRANSFERRED
            : TransactionType.TOKENS_TRANSFERRED,
        currencyType,
        amount: -amount,
        description,
        walletId,
        recipientWalletId,
      })

      // Create recipient transaction
      const recipientTransaction = this.transactionRepository.create({
        type:
          currencyType === CurrencyType.POINTS
            ? TransactionType.POINTS_TRANSFERRED
            : TransactionType.TOKENS_TRANSFERRED,
        currencyType,
        amount,
        description,
        walletId: recipientWalletId,
        recipientWalletId: walletId,
      })

      // Save all changes
      await queryRunner.manager.save(senderWallet)
      await queryRunner.manager.save(recipientWallet)
      const savedSenderTransaction = await queryRunner.manager.save(senderTransaction)
      const savedRecipientTransaction = await queryRunner.manager.save(recipientTransaction)

      // Commit transaction
      await queryRunner.commitTransaction()

      return [savedSenderTransaction, savedRecipientTransaction]
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  async getTransactionsByWalletId(walletId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { walletId },
      order: { createdAt: "DESC" },
    })
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { id } })

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`)
    }

    return transaction
  }
}

